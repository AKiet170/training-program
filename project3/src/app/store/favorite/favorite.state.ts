import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { FavoriteActions } from './favorite.actions';
import { FavoriteService } from '../../services/favorite';

export interface FavoriteStateModel {
  favoriteIds: string[]; 
}

@State<FavoriteStateModel>({
  name: 'favorite',
  defaults: { favoriteIds: [] },
})
@Injectable()
export class FavoriteState {
  constructor(private favoriteService: FavoriteService) {}

  @Selector()
  static getFavoriteIds(state: FavoriteStateModel): string[] {
    return state.favoriteIds;
  }

  // ✅ CHỨC NĂNG 1: Đồng bộ hóa khi reload (ngOnInit)
  @Action(FavoriteActions.LoadFavorites)
  loadFavorites(ctx: StateContext<FavoriteStateModel>) {
    // 1. Đọc dữ liệu từ Local Storage qua Service
    const savedIds = this.favoriteService.loadFavoritesIds();
    
    // 2. Cập nhật State
    ctx.patchState({ favoriteIds: savedIds });
  }

  // ✅ CHỨC NĂNG 2: Thêm/Xoá và Cập nhật State
  @Action(FavoriteActions.ToggleFavorite)
  handleToggle(ctx: StateContext<FavoriteStateModel>, action: FavoriteActions.ToggleFavorite) {
    // 1. Gọi Service để xử lý logic thêm/xoá và lưu vào Local Storage
    const updatedIds = this.favoriteService.toggleFavorite(action.name);
    
    // 2. Cập nhật State bằng danh sách mới
    ctx.patchState({ favoriteIds: updatedIds });
  }
}