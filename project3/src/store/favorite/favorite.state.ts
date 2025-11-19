import { State, Action, Selector, StateContext } from '@ngxs/store';
import { FavoriteAction } from './favorite.actions';

export interface FavoriteStateModel {
  items: string[];
}

@State<FavoriteStateModel>({
  name: 'favorite',
  defaults: {
    items: []
  }
})
export class FavoriteState {

  @Selector()
  public static getState(state: FavoriteStateModel) {
    return state;
  }

  @Action(FavoriteAction)
  public add(ctx: StateContext<FavoriteStateModel>, { payload }: FavoriteAction) {
    const stateModel = ctx.getState();
    stateModel.items = [...stateModel.items, payload];
    ctx.setState(stateModel);
  }
}
