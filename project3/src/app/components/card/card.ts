import { Component, input, Input, OnInit, TemplateRef, ViewChild } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';  
import { map, Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { NzSpinModule } from 'ng-zorro-antd/spin'; 
import { FavoriteActions } from '../../store/favorite/favorite.actions';
import { PokemonState } from '../../store/pokemon-list/pokemon.state';
import { PokemonActions } from '../../store/pokemon-list/pokemon.actions';

export interface CardViewModel {
  name: string;
  imgUrl: string;
  rarity: 'Common' | 'Legendary' | 'Mythical';
  isFavorite: boolean;
  element: string;
}

const TYPE_ICON_MAP: { [key: string]: string } = {
  'fire': 'assets/icons/fire.svg',
  'water': 'assets/icons/water.svg',
  'grass': 'assets/icons/grass.svg',
  'electric': 'assets/icons/electric.svg',
  'normal': 'assets/icons/normal.svg',
  'fairy': 'assets/icons/fairy.svg',
  'dark': 'assets/icons/dark.svg',
  'bug': 'assets/icons/bug.svg',
  'dragon': 'assets/icons/dragon.svg',
  'fighting': 'assets/icons/fighting.svg',
  'flying': 'assets/icons/flying.svg',
  'ghost': 'assets/icons/ghost.svg',
  'ground': 'assets/icons/ground.svg',
  'ice': 'assets/icons/ice.svg',
  'poison': 'assets/icons/poison.svg',
  'psychic': 'assets/icons/psychic.svg',
  'rock': 'assets/icons/rock.svg',
  'steel': 'assets/icons/steel.svg',
  'default': 'assets/icons/default.svg' 
};

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzModalModule, NzButtonModule, NzIconModule, NzSpinModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})


export class Card implements OnInit { 

  @ViewChild('extraTemplate') extraTemplate!: TemplateRef<any>;
  @Input() pokemon!: CardViewModel;
  selectedPokemon$!: Observable<any>;
  isLoading$!: Observable<any>;
  

  constructor(private store: Store) {
    this.selectedPokemon$ = this.store.select(PokemonState.getSelectedPokemon);
    this.isLoading$ = this.store.select(PokemonState.isLoading)
  }


  isVisibleTop = false;
  isVisibleMiddle = false;

  getTypeIcon(type: string): string {
    return TYPE_ICON_MAP[type];
  }

  showModalTop(): void {
    this.isVisibleTop = true;
  }

  handleOkTop(): void {
    console.log('OK');
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
    // Modal xác nhận khoá khỏi danh sách yêu thích
    this.store.dispatch(new FavoriteActions.ToggleFavorite(this.pokemon.name));
  }

  showModalMiddle(): void {
    const pokemonName = this.pokemon.name;

    // Chỉ gọi API chi tiết khi người dùng mở Modal
    this.store.dispatch(new PokemonActions.GetPokemonDetails(pokemonName));

    this.isVisibleMiddle = true;
  }

  ngOnInit(): void {
  }
}