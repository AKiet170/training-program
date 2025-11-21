import { State, Action, Selector, StateContext } from '@ngxs/store';
import { PokemonDetailsAction } from './pokemon-details.actions';
import { PokemonService } from '../../services/pokemon';
import { Injectable } from '@angular/core'  ;
import { finalize, tap } from 'rxjs/operators';

export interface PokemonDetailsStateModel {
  imgUrl: string;
  name: string;
  stats: any[];
  isLoading: boolean;
}

@State<PokemonDetailsStateModel>({
  name: 'pokemonDetails',
  defaults: {
    imgUrl: '',
    name: '',
    stats: [],
    isLoading: false,
  }
})

@Injectable()
export class PokemonDetailsState {
  constructor(private pokemonService: PokemonService) {}

  @Selector()
  public static getUrl(state: PokemonDetailsStateModel) {
    return state.imgUrl;
  }

  @Selector()
  public static getName(state: PokemonDetailsStateModel) {
    return state.name;
  }

  @Selector()
  public static getStats(state: PokemonDetailsStateModel) {
    return state.stats;
  }

  @Selector()
  public static isLoading(state: PokemonDetailsStateModel) {
    return state.isLoading;
  }

@Action(PokemonDetailsAction)
getPokemonDetails(ctx: StateContext<PokemonDetailsStateModel>, action: PokemonDetailsAction) {

  ctx.patchState({ isLoading: true });
    return this.pokemonService.getPokemonDetails(action.name).pipe(
        tap((details) => {
            ctx.patchState({
                imgUrl: details.sprites.front_default,
                name: details.name, 
                stats: details.stats
            });
        }),
        finalize(() => {
        ctx.patchState({ isLoading: false });
      })
    );
}
}