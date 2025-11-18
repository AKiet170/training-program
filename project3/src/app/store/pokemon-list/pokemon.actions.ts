export enum Actions {
  GET_POKEMON_LIST = '[Pokemon] Get Pokemon List',
  GET_POKEMON_DETAILS = '[Pokemon] Get Pokemon Details',
  GET_POKEMON_BY_FAVORITE = '[Pokemon] Get Pokemon By Favorite',
}

export namespace PokemonActions {
  export class GetPokemonList {
    static type = Actions.GET_POKEMON_LIST;
    constructor() {}
  }

  export class GetPokemonDetails {
    static type = Actions.GET_POKEMON_DETAILS;
    constructor(public payload: any) {}
  }

  export class GetPokemonByFavorite {
    static type = Actions.GET_POKEMON_BY_FAVORITE;
    constructor() {};
  }
}
