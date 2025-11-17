import { Component } from '@angular/core';
import { SearchBar } from '../../components/search-bar/search-bar';
import { FormsModule } from '@angular/forms';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMarks, NzSliderModule } from 'ng-zorro-antd/slider';
import { CardList } from '../../components/card-list/card-list';


@Component({
  selector: 'app-home',
  imports: [FormsModule, NzGridModule, NzSliderModule, SearchBar, CardList],
  templateUrl: './home.html',
  styleUrl: './home.scss'
  
})
export class Home {
  hGutter = 48;
  vGutter = 48;
  count = 4;
  array = new Array(this.count);
}