import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'materials',
        loadComponent: () =>
          import('./pages/materials/materials.page').then(m => m.MaterialsPage),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/products.page').then(m => m.ProductsPage),
      },
      {
        path: 'lots',
        loadComponent: () =>
          import('./pages/lots/lots.page').then(m => m.LotsPage),
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('./pages/sales/sales.page').then(m => m.SalesPage),
      },
    ],
  },
  // Rutas de detalle / formularios
  {
    path: 'materials/new',
    loadComponent: () =>
      import('./pages/materials/material-form/material-form.page').then(m => m.MaterialFormPage),
  },
  {
    path: 'materials/:id/edit',
    loadComponent: () =>
      import('./pages/materials/material-form/material-form.page').then(m => m.MaterialFormPage),
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('./pages/products/product-form/product-form.page').then(m => m.ProductFormPage),
  },
  {
    path: 'products/:id/edit',
    loadComponent: () =>
      import('./pages/products/product-form/product-form.page').then(m => m.ProductFormPage),
  },
  {
    path: 'products/:id/recipe',
    loadComponent: () =>
      import('./pages/products/recipe-editor/recipe-editor.page').then(m => m.RecipeEditorPage),
  },
  {
    path: 'lots/new',
    loadComponent: () =>
      import('./pages/lots/lot-form/lot-form.page').then(m => m.LotFormPage),
  },
  {
    path: 'lots/:id',
    loadComponent: () =>
      import('./pages/lots/lot-detail/lot-detail.page').then(m => m.LotDetailPage),
  },
  {
    path: 'sales/new',
    loadComponent: () =>
      import('./pages/sales/sale-form/sale-form.page').then(m => m.SaleFormPage),
  },
];
