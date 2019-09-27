import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Repo } from './repo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userName: string;
  sortDirection = 'desc';
  repos: Repo[];
  errorMessage: string;

  constructor(protected http: HttpClient) {
  }

  loadStarred() {
    this.http.get<Repo[]>(`https://api.github.com/users/${this.userName}/starred`)
      .pipe(
        tap(
          response => {
            this.repos = response;
            this.errorMessage = null;
          }
        ),
        catchError(error => {
          this.repos = [];
          this.errorMessage = error && error.error && error.error.message || 'Unknown error';
          return of([]);
        })
      )
      .subscribe();
  }

}
