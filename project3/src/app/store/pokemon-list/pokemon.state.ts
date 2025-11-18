import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { PokemonActions } from './pokemon.actions';
import { PokemonService } from '../../services/pokemon';

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
  count: number;
  loading: boolean;
  favorite: Pokemon[];
}


@State<PokemonStateModel>({
  name: 'pokemon', 
  defaults: {
    pokemonList: [],
    count: 0,
    loading: false,
    favorite: [],
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

  @Selector()
  static getFavorite(state: PokemonStateModel): Pokemon[] {
    return state.favorite;
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
}