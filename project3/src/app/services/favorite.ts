import { Injectable } from '@angular/core';

const FAVORITES_KEY = 'pokemon_favorites';

@Injectable({ providedIn: 'root' })
export class FavoriteService {

  public loadFavoritesIds(): string[] {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveFavoritesIds(ids: string[]): void {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  }

  public toggleFavorite(name: string): string[] {
    let ids = this.loadFavoritesIds();
    const index = ids.indexOf(name);

    if (index > -1) {
      ids.splice(index, 1); // Xóa (nếu đã tồn tại)
    } else {
      ids.push(name); // Thêm
    }
    
    this.saveFavoritesIds(ids);
    return ids; // Trả về danh sách mới
  }
}
