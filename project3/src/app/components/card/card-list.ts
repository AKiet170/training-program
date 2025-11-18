import { Component, Input, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { NzCardModule } from 'ng-zorro-antd/card';
@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, NzCardModule],
  templateUrl: './card-list.html',
  styleUrl: './card-list.scss',
})
export class CardList implements OnInit { 
  @Input() pokemon!: any;
  firstPokemon: any;

  ngOnInit(): void {
    // const [firstPokemon] = this.pokemon;
    // console.log(firstPokemon);
    console.log(this.pokemon); 
  }

}