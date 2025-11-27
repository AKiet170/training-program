import { Component, OnInit } from '@angular/core';
import { SearchBar } from '../../components/search-bar/search-bar';
import { FormsModule } from '@angular/forms';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { Card } from '../../components/card/card';
import { Store} from '@ngxs/store';
import { Observable } from 'rxjs';
import { PokemonActions } from '../../store/pokemon-list/pokemon.actions';
import { PokemonState } from '../../store/pokemon-list/pokemon.state';
import { AsyncPipe } from '@angular/common';
import { FavoriteActions } from '../../store/favorite/favorite.actions';


@Component({
  selector: 'app-home',
  imports: [FormsModule, NzGridModule, NzSliderModule, SearchBar, Card, AsyncPipe, NzPaginationModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
  
})
export class Home implements OnInit {
  hGutter = 48;
  vGutter = 48;
  count = 4;
  array = new Array(20);

  pageIndex$: Observable<number>;
  pageSize$: Observable<number>;
  total$: Observable<number>;
  loading$!: Observable<boolean>;
  cardViewModel$!: Observable<any[]>;

  searchResults: string = '';

  constructor(private store: Store) {
    this.total$ = this.store.select(PokemonState.getTotal);
    this.loading$ = this.store.select(PokemonState.isLoading);
    this.cardViewModel$ = this.store.select(PokemonState.getCardViewModel)
    this.pageIndex$ = this.store.select(PokemonState.getPageIndex)
    this.pageSize$ = this.store.select(PokemonState.getPageSize)
  }

  onPageIndexChange(newPageIndex: number) {
    this.store.dispatch(new PokemonActions.ChangePage(newPageIndex));
    
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
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