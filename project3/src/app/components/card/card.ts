import { Component, input, Input, OnInit, TemplateRef, ViewChild, SimpleChanges } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';  
import { map, Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { NzSpinModule } from 'ng-zorro-antd/spin'; 
import { FavoriteActions } from '../../store/favorite/favorite.actions';
import { PokemonState } from '../../store/pokemon-list/pokemon.state';
import { PokemonActions } from '../../store/pokemon-list/pokemon.actions';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { EChartsOption } from 'echarts';


export interface CardViewModel {
  name: string;
  imgUrl: string;
  rarity: 'Common' | 'Legendary' | 'Mythical';
  isFavorite: boolean;
  element: string;
  stats: any[];
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
  imports: [CommonModule, NzCardModule, NzModalModule, NzButtonModule, NzIconModule, NzSpinModule, NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') }),
    },
  ],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})


export class Card implements OnInit { 

  @ViewChild('extraTemplate') extraTemplate!: TemplateRef<any>;
  @Input() pokemon!: CardViewModel;
  chartOption: EChartsOption = {};
  selectedPokemon$!: Observable<any>;
  isLoading$!: Observable<any>;
  

  constructor(private store: Store, private modal: NzModalService) {
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
    if (this.pokemon.isFavorite) {
      this.modal.confirm({
        nzTitle: 'Xác nhận xoá',
        nzContent: `Bạn có chắc chắn muốn xóa <b>${this.pokemon.name.toUpperCase()}</b> khỏi danh sách yêu thích không?`,
        nzOkText: 'Xóa',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => {
          this.dispatchToggleAction();
        },
        nzCancelText: 'Hủy',
        nzOnCancel: () => console.log('Đã hủy xóa')
      });
    } 
    else {
      this.dispatchToggleAction();
    }
  }

  private dispatchToggleAction() {
    this.store.dispatch(new FavoriteActions.ToggleFavorite(this.pokemon.name));
  }

  showModalMiddle(): void {
    const pokemonName = this.pokemon.name;

    // Chỉ gọi API chi tiết khi người dùng mở Modal
    this.store.dispatch(new PokemonActions.GetPokemonDetails(pokemonName));

    this.isVisibleMiddle = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pokemon'] && this.pokemon) {
      this.updateChart();
    }
  }

  updateChart(): void {
    if (!this.pokemon || !this.pokemon.stats) return;

    // Chuẩn bị dữ liệu
    const categories = this.pokemon.stats.map((s: any) => s.stat.name.toUpperCase());
    const data = this.pokemon.stats.map((s: any) => s.base_stat);

    // Cấu hình biểu đồ nằm ngang
    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        splitLine: { show: false } 
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          interval: 0, 
          fontSize: 10 
        }
      },
      series: [
        {
          name: 'Base Stat',
          type: 'bar', 
          data: data,
          itemStyle: {
            color: (params: any) => {
              const value = params.value as number;
              if (value > 100) return '#4caf50';
              if (value > 50) return '#2196f3'; 
              return '#f44336';                 
            },
            borderRadius: [0, 4, 4, 0]
          },
          label: {
            show: true,
            position: 'right', 
            valueAnimation: true
          },
          barWidth: '60%' 
        }
      ]
    };
  }


  ngOnInit(): void {
    this.updateChart();
  }
}