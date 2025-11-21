import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input'; 
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, NzButtonModule, NzInputModule, NzIconModule], 
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  @Output() searchSubmitted = new EventEmitter<string>(); 
  searchTerm: string = '';

  onSearch() {
    this.searchSubmitted.emit(this.searchTerm); 
  }
}