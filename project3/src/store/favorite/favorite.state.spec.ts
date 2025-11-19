import { TestBed, async } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { FavoriteState, FavoriteStateModel } from './favorite.state';
import { FavoriteAction } from './favorite.actions';

describe('Favorite store', () => {
  let store: Store;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([FavoriteState])]
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  it('should create an action and add an item', () => {
    const expected: FavoriteStateModel = {
      items: ['item-1']
    };
    store.dispatch(new FavoriteAction('item-1'));
    const actual = store.selectSnapshot(FavoriteState.getState);
    expect(actual).toEqual(expected);
  });

});
