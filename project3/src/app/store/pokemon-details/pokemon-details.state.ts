import { State, Action, Selector, StateContext } from '@ngxs/store';
import { PokemonDetailsAction } from './pokemon-details.actions';

export interface PokemonDetailsStateModel {
  img_url: string;
  items: string[];
  stats: any[];
}

@State<PokemonDetailsStateModel>({
  name: 'pokemonDetails',
  defaults: {
    img_url: '',
    items: [],
    stats: []
  }
})
export class PokemonDetailsState {

  @Selector()
  public static getState(state: PokemonDetailsStateModel) {
    return state;
  }

  @Action(PokemonDetailsAction)
  public add(ctx: StateContext<PokemonDetailsStateModel>, { payload }: PokemonDetailsAction) {
    const stateModel = ctx.getState();
    stateModel.items = [...stateModel.items, payload];
    ctx.setState(stateModel);
  }
}
