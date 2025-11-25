import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FavoriteActions } from '../../store/favorite/favorite.actions';
import { PokemonActions } from '../../store/pokemon-list/pokemon.actions';
import { Pokemon, PokemonState } from '../../store/pokemon-list/pokemon.state';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { Card } from '../../components/card/card';
import { SearchBar } from '../../components/search-bar/search-bar';

@Component({
  selector: 'app-favorite',
  imports: [FormsModule, NzGridModule, NzSliderModule, SearchBar, Card, AsyncPipe],
  templateUrl: './favorite.html',
  styleUrl: './favorite.scss',
})
export class Favorite implements OnInit {
  hGutter = 48;
  vGutter = 48;
  count = 4;
  array = new Array(20);

  count$!: Observable<number>;
  loading$!: Observable<boolean>;
  cardViewModel$!: Observable<any[]>;

  searchResults: string = '';

  constructor(private store: Store) {
    this.count$ = this.store.select(PokemonState.getCount);
    this.loading$ = this.store.select(PokemonState.isLoading);
    this.cardViewModel$ = this.store.select(PokemonState.getCardViewModel)
  }

  handleSearch(searchTerm: string) {
    console.log('Search term submitted:', searchTerm);
    this.store.dispatch(new PokemonActions.SearchPokemon(searchTerm));

  }

  ngOnInit() {
    this.store.dispatch(new PokemonActions.GetPokemonList());
    //Đông bộ hóa danh sách yêu thích khi trang được tải lại
    this.store.dispatch(new FavoriteActions.LoadFavorites());
  }
}
