import { Component, OnInit } from '@angular/core';
import { SearchBar } from '../../components/search-bar/search-bar';
import { FormsModule } from '@angular/forms';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMarks, NzSliderModule } from 'ng-zorro-antd/slider';
import { CardList } from '../../components/card/card-list';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PokemonActions } from '../../store/pokemon-list/pokemon.actions';
import { Pokemon, PokemonState } from '../../store/pokemon-list/pokemon.state';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [FormsModule, NzGridModule, NzSliderModule, SearchBar, CardList, AsyncPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
  
})
export class Home implements OnInit {
  hGutter = 48;
  vGutter = 48;
  count = 4;
  array = new Array(20);

  pokemons$!: Observable<Pokemon[]>;
  count$!: Observable<number>;
  loading$!: Observable<boolean>;

  constructor(private store: Store) {
    this.pokemons$ = this.store.select(PokemonState.getPokemonList);
    this.count$ = this.store.select(PokemonState.getCount);
    this.loading$ = this.store.select(PokemonState.isLoading);
  }

  ngOnInit() {
    this.store.dispatch(new PokemonActions.GetPokemonList());
  };

}