import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root',
})
export class ShopFormService {
  baseUrl: string = 'http://localhost:8080/api';

  constructor(private httpClient: HttpClient) {}

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    const curYear = new Date().getFullYear();
    for (let theYear = curYear; theYear <= curYear + 10; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }

  getCountries(): Observable<Country[]> {
    const url = `${this.baseUrl}/countries`;

    return this.httpClient
      .get<getResponseCountries>(url)
      .pipe(map((response) => response._embedded.countries));
  }

  getStatesByCountryCode(theCode: string = "BR"): Observable<State[]> {
    const url = `${this.baseUrl}/states/search/findByCountryCode?code=${theCode}`;

    return this.httpClient
      .get<getResponseStates>(url)
      .pipe(map((response) => response._embedded.states));
  }
}

interface getResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

interface getResponseStates {
  _embedded: {
    states: State[];
  };
}