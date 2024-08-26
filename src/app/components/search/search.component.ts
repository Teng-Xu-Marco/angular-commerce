import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  constructor(private router: Router) {}

  onSearchHandler(name: string, event: Event) {
    event.preventDefault();

    this.router.navigateByUrl(`/search/${name}`);
  }

}
