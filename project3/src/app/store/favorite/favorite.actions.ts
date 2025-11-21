export namespace FavoriteActions {
  // Action cho ngOnInit để tải dữ liệu ban đầu
  export class LoadFavorites {
    static readonly type = '[Favorite] Load Favorites';
    constructor() {}
  } 

  // Action để yêu cầu thêm/xoá Pokémon
  export class ToggleFavorite {
    static readonly type = '[Favorite] Toggle Pokemon';
    constructor(public name: string) {}
  }
}