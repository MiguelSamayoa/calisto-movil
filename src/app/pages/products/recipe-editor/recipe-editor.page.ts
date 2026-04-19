import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonButton, IonItem, IonLabel, IonInput,
  IonIcon, IonList, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonNote, IonChip, IonSegment, IonSegmentButton,
  IonFab, IonFabButton, IonSelect, IonSelectOption,
  ToastController, AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, saveOutline, cubeOutline, bagOutline } from 'ionicons/icons';
import { ProductService } from '@services/product.service';
import { MaterialService } from '@services/material.service';
import { Material } from '@models/material.model';
import { Product, ProductWithRecipe } from '@models/product.model';
import { GtqCurrencyPipe } from '@shared/pipes/gtq-currency.pipe';

interface RecipeRow {
  type: 'material' | 'subproduct';
  materialId: number | null;
  subProductId: number | null;
  name: string;
  unit: string;
  unitCost: number;
  quantity: number;
}

@Component({
  selector: 'app-recipe-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule, GtqCurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonButton, IonItem, IonLabel, IonInput,
    IonIcon, IonList, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonNote, IonChip, IonSegment, IonSegmentButton,
    IonFab, IonFabButton, IonSelect, IonSelectOption,
  ],
  templateUrl: './recipe-editor.page.html',
  styleUrls: ['./recipe-editor.page.scss'],
})
export class RecipeEditorPage implements OnInit {
  product: ProductWithRecipe | null = null;
  allMaterials: Material[] = [];
  allProducts: Product[] = [];   // para seleccionar subproductos
  rows: RecipeRow[] = [];
  saving = false;

  // Selector de tipo de ingrediente
  newIngredientType: 'material' | 'subproduct' = 'material';

  // Campos para agregar material
  newMaterialId: number | null = null;
  newMaterialQty: number | null = null;

  // Campos para agregar subproducto
  newSubProductId: number | null = null;
  newSubProductQty: number | null = null;
  newSubProductUnitCost = 0; // se calcula al seleccionar

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private materialService: MaterialService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({ addOutline, trashOutline, saveOutline, cubeOutline, bagOutline });
  }

  async ngOnInit(): Promise<void> {
    const id = +(this.route.snapshot.paramMap.get('id') ?? '0');
    const [product, materials, products] = await Promise.all([
      this.productService.getWithRecipe(id),
      this.materialService.getAll(),
      this.productService.getAll(),
    ]);

    if (!product) {
      this.showToast('Producto no encontrado', 'danger');
      this.router.navigate(['/tabs/products']);
      return;
    }

    this.product = product;
    this.allMaterials = materials;
    // Excluir el producto actual de los posibles subproductos
    this.allProducts = products.filter(p => p.id !== id);

    this.rows = product.recipe.map(r => ({
      type: r.type,
      materialId: r.materialId,
      subProductId: r.subProductId,
      name: r.materialName,
      unit: r.materialUnit,
      unitCost: r.unitCost,
      quantity: r.quantity,
    }));
  }

  get totalCostPerBatch(): number {
    return this.rows.reduce((sum, r) => sum + r.quantity * r.unitCost, 0);
  }

  get costPerUnit(): number {
    const y = this.product?.yieldUnits ?? 0;
    return y > 0 ? this.totalCostPerBatch / y : 0;
  }

  get selectedMaterialUnit(): string {
    if (!this.newMaterialId) return 'unidad';
    return this.allMaterials.find(m => m.id === this.newMaterialId)?.unit ?? 'unidad';
  }

  get availableMaterials(): Material[] {
    const usedIds = new Set(this.rows.filter(r => r.type === 'material').map(r => r.materialId));
    return this.allMaterials.filter(m => !usedIds.has(m.id));
  }

  get availableSubProducts(): Product[] {
    const usedIds = new Set(this.rows.filter(r => r.type === 'subproduct').map(r => r.subProductId));
    return this.allProducts.filter(p => !usedIds.has(p.id));
  }

  async onSubProductChange(): Promise<void> {
    if (!this.newSubProductId) { this.newSubProductUnitCost = 0; return; }
    const sp = await this.productService.getWithRecipe(this.newSubProductId);
    this.newSubProductUnitCost = sp?.recipeCostPerUnit ?? 0;
  }

  addMaterial(): void {
    if (!this.newMaterialId || !this.newMaterialQty || this.newMaterialQty <= 0) {
      this.showToast('Selecciona un material y cantidad', 'warning');
      return;
    }
    const m = this.allMaterials.find(m => m.id === this.newMaterialId)!;
    this.rows.push({
      type: 'material',
      materialId: m.id,
      subProductId: null,
      name: m.name,
      unit: m.unit,
      unitCost: m.unitCost,
      quantity: this.newMaterialQty,
    });
    this.newMaterialId = null;
    this.newMaterialQty = null;
  }

  addSubProduct(): void {
    if (!this.newSubProductId || !this.newSubProductQty || this.newSubProductQty <= 0) {
      this.showToast('Selecciona un subproducto y cantidad', 'warning');
      return;
    }
    const p = this.allProducts.find(p => p.id === this.newSubProductId)!;
    this.rows.push({
      type: 'subproduct',
      materialId: null,
      subProductId: p.id,
      name: p.name,
      unit: 'unidad',
      unitCost: this.newSubProductUnitCost,
      quantity: this.newSubProductQty,
    });
    this.newSubProductId = null;
    this.newSubProductQty = null;
    this.newSubProductUnitCost = 0;
  }

  removeRow(index: number): void {
    this.rows.splice(index, 1);
  }

  async save(): Promise<void> {
    if (!this.product) return;
    if (this.rows.length === 0) {
      this.showToast('Agrega al menos un ingrediente', 'warning');
      return;
    }
    this.saving = true;
    try {
      await this.productService.saveRecipe(
        this.product.id,
        this.rows.map(r => ({
          materialId: r.materialId,
          subProductId: r.subProductId,
          quantity: r.quantity,
        }))
      );
      this.showToast('Receta guardada', 'success');
      this.router.navigate(['/tabs/products']);
    } catch (err: unknown) {
      this.showToast(
        err instanceof Error ? err.message : 'Error al guardar receta',
        'danger'
      );
    } finally {
      this.saving = false;
    }
  }

  private async showToast(msg: string, color: string): Promise<void> {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color, position: 'bottom' });
    await t.present();
  }
}
