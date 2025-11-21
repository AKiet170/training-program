import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';

import { PokemonActions } from './pokemon.actions';
import { PokemonService } from '../../services/pokemon';
import { of } from 'rxjs';
import { FavoriteState, FavoriteStateModel } from '../favorite/favorite.state';

export interface Pokemon {
  name: string;
  url: string;
  isFavorite: boolean;
}

export interface PokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface PokemonStateModel {
  pokemonList: Pokemon[];
  count: number;
  loading: boolean;
  searchResult: any | null;
  error: string | null; // Nên có để báo lỗi
}


@State<PokemonStateModel>({
  name: 'pokemon',
  defaults: {
    pokemonList: [],
    count: 0,
    loading: false,
    searchResult: null,
    error: null,
  },
})
@Injectable()
export class PokemonState {
  constructor(private pokemonService: PokemonService) {}

  @Selector()
  static getPokemonList(state: PokemonStateModel): Pokemon[] {
    return state.pokemonList;
  }

  @Selector()
  static getCount(state: PokemonStateModel): number {
    return state.count;
  }

  @Selector()
  static isLoading(state: PokemonStateModel): boolean {
    return state.loading;
  }

  @Selector([PokemonState, FavoriteState])
  static getCombinedList(state: PokemonStateModel, favState: FavoriteStateModel): any[] {
    let displayList: any[] = [];
    const favoriteSet = new Set(favState.favoriteIds);

    // Nếu có kết quả tìm kiếm, chỉ hiển thị kết quả đó
    if (state.searchResult) {
      displayList = [state.searchResult];
      return displayList.map((pokemon) => ({
        ...pokemon,
        isFavorite: favoriteSet.has(pokemon.name),
      }));
    }
    
    // Nếu không, trả về danh sách đầy đủ
    displayList = state.pokemonList;

    return displayList.map((pokemon) => ({
      ...pokemon,
      isFavorite: favoriteSet.has(pokemon.name),
    }));
  }

  @Action(PokemonActions.GetPokemonList)
  fetchPokemon(ctx: StateContext<PokemonStateModel>) {
    ctx.patchState({
      loading: true,
    });

    return this.pokemonService.getPokemonList().pipe(
      tap((response: PokemonResponse) => {
        ctx.patchState({
          pokemonList: response.results,
          count: response.count,
          loading: false,
        });
      })
    );
  }

  @Action(PokemonActions.SearchPokemon)
  searchPokemon(ctx: StateContext<PokemonStateModel>, action: PokemonActions.SearchPokemon) {
    ctx.patchState({ loading: true, searchResult: null, error: null });

    if (!action.name || action.name.trim() === '') {
      // Nếu rỗng, reset list và tải lại tất cả
      return ctx.dispatch(new PokemonActions.GetPokemonList());
    }

    // Gọi API lấy chi tiết
    return this.pokemonService.getPokemonDetails(action.name).pipe(
      tap((details) => {
        ctx.patchState({
          searchResult: details, // Lưu kết quả tìm kiếm (1 object)
          loading: false,
          pokemonList: [], // Xóa danh sách đầy đủ (tùy chọn)
        });
      }),
      catchError((err) => {
        // Xử lý lỗi (không tìm thấy)
        ctx.patchState({
          loading: false,
          searchResult: null,
          pokemonList: [],
          error: `Không tìm thấy Pokémon "${action.name}"`,
        });
        // Quan trọng: Trả về Observable an toàn để không làm hỏng stream chính
        return of(null);
      })
    );
  }
}