import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';  
import { Observable } from 'rxjs';
import { PokemonDetailsState } from '../../store/pokemon-details/pokemon-details.state';
import { Store } from '@ngxs/store';
import { PokemonDetailsAction } from '../../store/pokemon-details/pokemon-details.actions';
import { NzSpinModule } from 'ng-zorro-antd/spin'; 


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzModalModule, NzButtonModule, NzIconModule, NzSpinModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})

export class Card implements OnInit { 

  @ViewChild('extraTemplate') extraTemplate!: TemplateRef<any>;
  imgUrl$!: Observable<string>;
  name$!: Observable<string>;
  stats$!: Observable<any[]>;
  isLoading$!: Observable<boolean>;

  constructor(private store: Store) {
    this.imgUrl$ = this.store.select(PokemonDetailsState.getUrl);
    this.name$ = this.store.select(PokemonDetailsState.getName);
    this.stats$ = this.store.select(PokemonDetailsState.getStats);
    this.isLoading$ = this.store.select(PokemonDetailsState.isLoading);
  }


  @Input() pokemon!: any;
  firstPokemon: any;

  isVisibleTop = false;
  isVisibleMiddle = false;
  isFavorite = false;

  showModalTop(): void {
    this.isVisibleTop = true;
  }

  handleOkTop(): void {
    console.log('点击了确定');
    this.isVisibleTop = false;
  }

  handleCancelTop(): void {
    this.isVisibleTop = false;
  }

  handleOkMiddle(): void {
    console.log('click ok');
    this.isVisibleMiddle = false;
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  toggleFav() {
    this.isFavorite = !this.isFavorite;
  }

  showModalMiddle(): void {
    const pokemonName = this.pokemon.name;

    this.store.dispatch(new PokemonDetailsAction(pokemonName));

    this.isVisibleMiddle = true;
  }

  ngOnInit(): void {}

}