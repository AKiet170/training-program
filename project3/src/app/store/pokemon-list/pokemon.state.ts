import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { PokemonService } from '../../services/pokemon'; 
import { FavoriteState, FavoriteStateModel } from '../favorite/favorite.state'; 
import { PokemonActions } from './pokemon.actions'; 

export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface PokemonStateModel {
  pokemonList: Pokemon[];          
  pokemonDetailsMap: Record<string, any>; // Kho chứa dữ liệu chi tiết (Dùng chung cho cả Card và Modal)
  selectedPokemonName: string | null;     // Tên Pokemon đang được mở Modal
  count: number;
  pageIndex: number;
  pageSize: number;
  loading: boolean;
  next: string | null;
  previous: string | null;
  error: string | null;
}

@State<PokemonStateModel>({
  name: 'pokemon', 
  defaults: {
    pokemonList: [],
    pokemonDetailsMap: {},
    selectedPokemonName: null,
    count: 0,
    pageIndex: 1,
    pageSize: 20,
    loading: false,
    next: null,
    previous: null,
    error: null,
  },
})
@Injectable()
export class PokemonState {
  constructor(
    private pokemonService: PokemonService,
    private store: Store
  ) {}

  @Selector()
  static isLoading(state: PokemonStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static getPageIndex(state: PokemonStateModel): number {
    return state.pageIndex;
  }

  @Selector()
  static getTotal(state: PokemonStateModel): number {
    return state.count;
  }

  @Selector()
  static getPageSize(state: PokemonStateModel): number {
    return state.pageSize;
  }

  // Selector dùng cho GRID
  @Selector([PokemonState, FavoriteState])
  static getCardViewModel(state: PokemonStateModel, favState: FavoriteStateModel): any[] {
    const favoriteSet = new Set(favState.favoriteIds);
    const detailsMap = state.pokemonDetailsMap;

    // Duyệt qua pokemonList (List này có thể là 20 con hoặc 1 con do Search)
    return state.pokemonList.map((basicPokemon) => {
      const details = detailsMap[basicPokemon.name] || {}; 

      return {
        name: basicPokemon.name,

        imgUrl: details.imgUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.extractId(basicPokemon.url)}.png`, 
        rarity: details.rarity || 'Common', 
        isFavorite: favoriteSet.has(basicPokemon.name),
        stats: details.stats,
        element: details.element
      };
    });
  }

  // Selector dùng cho MODAL
  @Selector()
  static getSelectedPokemon(state: PokemonStateModel) {
    if (!state.selectedPokemonName) return null;
    return state.pokemonDetailsMap[state.selectedPokemonName];
  }

  // Helper function để lấy ID từ URL 
  private static extractId(url: string): string {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 2];
  }

  @Action(PokemonActions.GetPokemonList)
  fetchPokemon(ctx: StateContext<PokemonStateModel>) {
    ctx.patchState({ loading: true, error: null });
    
    const state = ctx.getState();
    const offset = (state.pageIndex - 1) * state.pageSize;
    const limit = state.pageSize;

    return this.pokemonService.getPokemonList(offset, limit).pipe(
      switchMap((response: PokemonResponse) => {
        // Lưu danh sách cơ bản
        ctx.patchState({
          pokemonList: response.results,
          count: response.count,
          next: response.next,
          previous: response.previous,
        });

        // Tạo mảng request song song để lấy chi tiết
        const detailRequests = response.results.map((pokemon) => 
          this.fetchDetailAndSpecies(pokemon.name)
        );

        return forkJoin(detailRequests);
      }),
      tap((allDetails: any[]) => {
        this.updateDetailsMap(ctx, allDetails);
      }),
      catchError((err) => {
        ctx.patchState({ loading: false, error: err.message });
        return of(null);
      })
    );
  }

  @Action(PokemonActions.ChangePage)
  changePage(ctx: StateContext<PokemonStateModel>, action: PokemonActions.ChangePage) {
    // Cập nhật PageIndex mới vào State
    ctx.patchState({ pageIndex: action.pageIndex });
    
    // Gọi lại Action lấy danh sách (nó sẽ tự tính offset mới dựa trên pageIndex vừa update)
    return ctx.dispatch(new PokemonActions.GetPokemonList());
  }

  // Chức năng Search 
  @Action(PokemonActions.SearchPokemon)
  searchPokemon(ctx: StateContext<PokemonStateModel>, action: PokemonActions.SearchPokemon) {
    ctx.patchState({ loading: true, error: null });

    const searchTerm = action.name?.trim().toLowerCase();

    // Nếu search rỗng -> Gọi lại list ban đầu
    if (!searchTerm) {
      return ctx.dispatch(new PokemonActions.GetPokemonList());
    }

    // Gọi API lấy chi tiết của con cần tìm
    return this.fetchDetailAndSpecies(searchTerm).pipe(
      tap((detail) => {
        // 1. Cập nhật Map chi tiết
        this.updateDetailsMap(ctx, [detail]);

        // 2. Cập nhật pokemonList chỉ chứa đúng 1 con này
        // Điều này giúp Selector getCardViewModel tự động render ra đúng 1 Card
        ctx.patchState({
          loading: false,
          pokemonList: [{ 
            name: detail.name, 
            url: `https://pokeapi.co/api/v2/pokemon/${detail.id}/` 
          }]
        });
      }),
      catchError((err) => {
        // Nếu không tìm thấy
        ctx.patchState({
          loading: false,
          pokemonList: [], // Rỗng list để UI hiện "Không tìm thấy"
          error: `Không tìm thấy Pokémon "${action.name}"`,
        });
        return of(null);
      })
    );
  }

  // 3. Chức năng xem chi tiết (Dùng cho Modal)
  // Action này thay thế cho PokemonDetailsActions.PokemonDetailsAction cũ
  @Action(PokemonActions.GetPokemonDetails) // Bạn cần define action này trong file actions
  getPokemonDetails(ctx: StateContext<PokemonStateModel>, action: { name: string }) {
    const state = ctx.getState();
    const name = action.name;

    // Set tên con đang chọn trước để mở Modal
    ctx.patchState({ selectedPokemonName: name });

    // Kiểm tra xem trong Map đã có dữ liệu chưa
    if (state.pokemonDetailsMap[name] && state.pokemonDetailsMap[name].stats) {
      // Nếu đã có đủ dữ liệu (từ list hoặc lần xem trước), không cần gọi API lại
      return of(null);
    }

    // Nếu chưa có, gọi API
    ctx.patchState({ loading: true });
    return this.fetchDetailAndSpecies(name).pipe(
      tap((detail) => {
        this.updateDetailsMap(ctx, [detail]);
        ctx.patchState({ loading: false });
      }),
      catchError(() => {
        ctx.patchState({ loading: false });
        return of(null);
      })
    );
  }

@Action(PokemonActions.GetFavoriteList)
  getFavoriteList(ctx: StateContext<PokemonStateModel>) {
    ctx.patchState({ loading: true, error: null });

    // 1. Lấy danh sách ID yêu thích từ FavoriteState (Snapshot)
    const favoriteIds = this.store.selectSnapshot(FavoriteState.getFavoriteIds);

    // Nếu không có favorite nào
    if (!favoriteIds || favoriteIds.length === 0) {
      ctx.patchState({
        loading: false,
        pokemonList: [], // Danh sách rỗng
        count: 0
      });
      return of(null);
    }

    // 2. Tạo mảng request để lấy chi tiết cho TỪNG favorite ID
    // Tận dụng hàm fetchDetailAndSpecies có sẵn để lấy full thông tin (ảnh, rarity...)
    const requests = favoriteIds.map(id => this.fetchDetailAndSpecies(id));

    // 3. Chạy song song tất cả request
    return forkJoin(requests).pipe(
      tap((favoritesDetails: any[]) => {
        // Cập nhật Details Map (để cache)
        this.updateDetailsMap(ctx, favoritesDetails);

        // Cập nhật pokemonList với danh sách favorite vừa tải
        ctx.patchState({
          loading: false,
          pokemonList: favoritesDetails.map(d => ({
            name: d.name,
            url: `https://pokeapi.co/api/v2/pokemon/${d.id}/`
            // Các dữ liệu khác đã được lưu trong detailsMap và sẽ được Selector getCardViewModel lấy ra
          })),
          count: favoritesDetails.length
        });
      }),
      catchError(err => {
        ctx.patchState({ loading: false, error: err.message });
        return of(null);
      })
    );
  }

  // Helper: Gọi API Details + Species và normalize dữ liệu
  private fetchDetailAndSpecies(name: string) {
    return forkJoin({
      details: this.pokemonService.getPokemonDetails(name),
      species: this.pokemonService.getPokemonSpecies(name)
    }).pipe(
      map(({ details, species }) => ({
        id: details.id,
        name: details.name,
        imgUrl: details.sprites.front_default,
        stats: details.stats,
        element: details.types[0].type.name,
        is_mythical: species.is_mythical,
        is_legendary: species.is_legendary,
        rarity: species.is_mythical ? 'Mythical' : 
                species.is_legendary ? 'Legendary' : 'Common'
      }))
    );
  }

  // Helper: Cập nhật Map vào State
  private updateDetailsMap(ctx: StateContext<PokemonStateModel>, newDetails: any[]) {
    const currentState = ctx.getState();
    
    const newDetailsMap = newDetails.reduce((acc, item) => {
      acc[item.name] = item; 
      return acc;
    }, { ...currentState.pokemonDetailsMap }); 
    ctx.patchState({
      loading: false,
      pokemonDetailsMap: newDetailsMap
    });
  }
}