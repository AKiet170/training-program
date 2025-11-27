import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PokemonResponse } from '../store/pokemon-list/pokemon.state';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {

  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemonList(offset: number = 0, limit: number = 20): Observable<PokemonResponse> {
    return this.http.get<PokemonResponse>(
      `${this.apiUrl}?offset=${offset}&limit=${limit}`
    );
  }

  getPokemonDetails(name: string): Observable<any> {
    const url = `${this.apiUrl}/${name}`;
    return this.http.get<any>(url);
  }

  getPokemonSpecies(name: string): Observable<any> {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon-species/${name}`;
    return this.http.get<any>(apiUrl);
  }
}