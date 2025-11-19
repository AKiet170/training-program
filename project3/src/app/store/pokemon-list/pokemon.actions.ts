export enum Actions {
  GET_POKEMON_LIST = '[Pokemon] Get Pokemon List',
  GET_FAVORITE_POKEMONS = '[Pokemon] Get Favorite Pokemons',
}

export namespace PokemonActions {
  export class GetPokemonList {
    static type = Actions.GET_POKEMON_LIST;
    constructor() {}
  }

  export class GetFavoritePokemons {
    static type = Actions.GET_FAVORITE_POKEMONS;
    constructor() {};
  }
}
