import { State, Action, Selector, StateContext } from '@ngxs/store';
import { PokemonDetailsActions } from './pokemon-details.actions';
import { PokemonService } from '../../services/pokemon';
import { Injectable } from '@angular/core'  ;
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { PokemonActions } from '../pokemon-list/pokemon.actions';
import { forkJoin, of } from 'rxjs';

export interface PokemonDetailsStateModel {
  imgUrl: string;
  name: string;
  stats: any[];
  is_common: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  isLoading: boolean;
}

@State<PokemonDetailsStateModel>({
  name: 'pokemonDetails',
  defaults: {
    imgUrl: '',
    name: '',
    is_common: false,
    is_legendary: false,
    is_mythical: false,
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

  @Selector()
  public static getRarity(state: PokemonDetailsStateModel) {
  return {
    is_common: state.is_common,
    is_legendary: state.is_legendary,
    is_mythical: state.is_mythical,
  };
}

@Action(PokemonDetailsActions.PokemonDetailsAction)
getPokemonDetails(ctx: StateContext<PokemonDetailsStateModel>, action: PokemonDetailsActions.PokemonDetailsAction) {

  ctx.patchState({ isLoading: true });

  const details$ = this.pokemonService.getPokemonDetails(action.name);
  const species$ = this.pokemonService.getPokemonSpecies(action.name); 

  return forkJoin({
    details: details$,
    species: species$,
  }).pipe(
    tap((results) => {
      ctx.patchState({
        imgUrl: results.details.sprites.front_default,
        name: results.details.name, 
        stats: results.details.stats,

        is_legendary: results.species.is_legendary,
        is_mythical: results.species.is_mythical,
        is_common: !results.species.is_legendary && !results.species.is_mythical,

        isLoading: false
      });
    }),
    catchError((error) => {
        ctx.patchState({ isLoading: false });
        return of(null); 
    })
  );
}

@Action(PokemonDetailsActions.GetRarity)
  getRarity(ctx: StateContext<PokemonDetailsStateModel>, action: PokemonDetailsActions.GetRarity) {
    return this.pokemonService.getPokemonSpecies(action.name).pipe(
      tap((results) => {
        ctx.patchState({
          is_common: !results.is_legendary && !results.is_mythical,
          is_legendary: results.is_legendary,
          is_mythical: results.is_mythical
        })
      })
    )
  }
}