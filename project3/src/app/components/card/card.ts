import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';  
import { map, Observable } from 'rxjs';
import { PokemonDetailsState } from '../../store/pokemon-details/pokemon-details.state';
import { Store } from '@ngxs/store';
import { PokemonDetailsActions } from '../../store/pokemon-details/pokemon-details.actions';
import { NzSpinModule } from 'ng-zorro-antd/spin'; 
import { FavoriteActions } from '../../store/favorite/favorite.actions';


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
  rarity$!: Observable<any>
  public rarityClass$!: Observable<string>;

  constructor(private store: Store) {
    this.imgUrl$ = this.store.select(PokemonDetailsState.getUrl);
    this.name$ = this.store.select(PokemonDetailsState.getName);
    this.stats$ = this.store.select(PokemonDetailsState.getStats);
    this.isLoading$ = this.store.select(PokemonDetailsState.isLoading);
    this.rarity$ = this.store.select(PokemonDetailsState.getRarity);
    this.rarityClass$ = this.rarity$.pipe(
      map(rarity => this.getRarityClass(rarity))
    );
  }


  @Input() pokemon!: any;

  isVisibleTop = false;
  isVisibleMiddle = false;

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
    this.store.dispatch(new FavoriteActions.ToggleFavorite(this.pokemon.name));
  }

  showModalMiddle(): void {
    const pokemonName = this.pokemon.name;

    // Chỉ gọi API chi tiết khi người dùng mở Modal
    this.store.dispatch(new PokemonDetailsActions.PokemonDetailsAction(pokemonName));

    this.isVisibleMiddle = true;
  }

  private getRarityClass(rarity: any): string {
    if (rarity.is_mythical) {
      return 'border-mythical'; // Ví dụ: Màu tím holo
    } else if (rarity.is_legendary) {
      return 'border-legendary'; // Ví dụ: Màu vàng gold
    } else if (rarity.is_common === true) {
      return 'border-common'; // Ví dụ: Viền xám hoặc xanh lá cây
    }
    return 'border-default';
  }

  ngOnInit(): void {
  }
}