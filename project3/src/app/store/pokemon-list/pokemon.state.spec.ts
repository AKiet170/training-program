import { TestBed, async } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { PokemonState, PokemonStateModel } from './pokemon.state';
import { PokemonAction } from './pokemon.actions';

describe('Pokemon store', () => {
  let store: Store;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([PokemonState])]
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  it('should create an action and add an item', () => {
    const expected: PokemonStateModel = {
      items: ['item-1']
    };
    store.dispatch(new PokemonAction('item-1'));
    const actual = store.selectSnapshot(PokemonState.getState);
    expect(actual).toEqual(expected);
  });

});
