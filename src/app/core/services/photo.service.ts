import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

export type PhotoEntityType = 'material' | 'product';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private readonly BASE_DIR = Directory.Data;
  private readonly PHOTO_DIR = 'calisto_photos';

  // ─── Captura de foto ──────────────────────────────────────────────────────

  /**
   * Abre la cámara o galería, guarda la foto en el filesystem local
   * y devuelve la ruta relativa almacenable en SQLite.
   */
  async takePhoto(
    entityType: PhotoEntityType,
    entityId?: number
  ): Promise<string | null> {
    try {
      const photo = await Camera.getPhoto({
        quality: 75,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,  // pregunta al usuario: cámara o galería
        promptLabelHeader: 'Foto',
        promptLabelPhoto: 'Elegir de galería',
        promptLabelPicture: 'Tomar foto',
        promptLabelCancel: 'Cancelar',
        saveToGallery: false,
      });

      if (!photo.base64String) return null;

      return await this.savePhoto(
        photo,
        entityType,
        entityId ?? Date.now()
      );
    } catch (error) {
      // El usuario canceló la selección
      if ((error as Error)?.message?.includes('cancelled')) return null;
      throw error;
    }
  }

  // ─── Guardar foto en filesystem ───────────────────────────────────────────

  private async savePhoto(
    photo: Photo,
    entityType: PhotoEntityType,
    entityId: number
  ): Promise<string> {
    await this.ensureDirectory();

    const fileName = `${entityType}_${entityId}_${Date.now()}.jpeg`;
    const filePath = `${this.PHOTO_DIR}/${fileName}`;

    await Filesystem.writeFile({
      path: filePath,
      data: photo.base64String!,
      directory: this.BASE_DIR,
    });

    return filePath;  // ruta relativa guardada en SQLite
  }

  // ─── Leer foto como Data URL ──────────────────────────────────────────────

  async getPhotoDataUrl(relativePath: string | null): Promise<string | null> {
    if (!relativePath) return null;

    try {
      const file = await Filesystem.readFile({
        path: relativePath,
        directory: this.BASE_DIR,
      });
      return `data:image/jpeg;base64,${file.data}`;
    } catch {
      return null;  // foto eliminada o path inválido
    }
  }

  // ─── Eliminar foto ────────────────────────────────────────────────────────

  async deletePhoto(relativePath: string | null): Promise<void> {
    if (!relativePath) return;
    try {
      await Filesystem.deleteFile({
        path: relativePath,
        directory: this.BASE_DIR,
      });
    } catch {
      // Ignorar si no existe
    }
  }

  // ─── Reemplazar foto (borra la anterior) ─────────────────────────────────

  async replacePhoto(
    oldPath: string | null,
    entityType: PhotoEntityType,
    entityId?: number
  ): Promise<string | null> {
    const newPath = await this.takePhoto(entityType, entityId);
    if (newPath) {
      await this.deletePhoto(oldPath);
    }
    return newPath;
  }

  // ─── Utilidades ───────────────────────────────────────────────────────────

  private async ensureDirectory(): Promise<void> {
    try {
      await Filesystem.mkdir({
        path: this.PHOTO_DIR,
        directory: this.BASE_DIR,
        recursive: true,
      });
    } catch {
      // El directorio ya existe, ignorar
    }
  }
}
