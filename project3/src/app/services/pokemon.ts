import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PokemonResponse } from '../store/pokemon-list/pokemon.state';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  // Base URL (đã bao gồm dấu / ở cuối)
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  constructor(private http: HttpClient) {}

  /**
   * Gọi API để lấy danh sách Pokémon (có phân trang)
   * @returns Observable chứa phản hồi từ PokeAPI
   */
  getPokemonList(): Observable<PokemonResponse> {
    return this.http.get<PokemonResponse>(this.apiUrl);
  }

  /**
   * Gọi API để lấy chi tiết một Pokémon cụ thể
   * @param name Tên hoặc ID của Pokémon (ví dụ: 'pikachu' hoặc 25)
   * @returns Observable chứa thông tin chi tiết
   */
  getPokemonDetails(name: string): Observable<any> {
    // Ghép base URL với tên pokemon. Ví dụ: https://pokeapi.co/api/v2/pokemon/pikachu
    const url = `${this.apiUrl}${name}`;
    return this.http.get<any>(url);
  }
}