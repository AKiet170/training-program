import { TestBed, async } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { PokemonDetailsState, PokemonDetailsStateModel } from './pokemon-details.state';
import { PokemonDetailsAction } from './pokemon-details.actions';

describe('PokemonDetails store', () => {
  let store: Store;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([PokemonDetailsState])]
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  it('should create an action and add an item', () => {
    const expected: PokemonDetailsStateModel = {
      items: ['item-1']
    };
    store.dispatch(new PokemonDetailsAction('item-1'));
    const actual = store.selectSnapshot(PokemonDetailsState.getState);
    expect(actual).toEqual(expected);
  });

});
