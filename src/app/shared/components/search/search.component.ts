import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchTerm: string = '';

  @Output() searchChange = new EventEmitter<string>();

  constructor() {}

  onSearchChange() {
    this.searchChange.emit(this.searchTerm);  
  }

  onSearchClick() {
    this.searchChange.emit(this.searchTerm);
  }
}
