export enum Actions {
  GET_POKEMON_LIST = '[Pokemon] Get Pokemon List',
  GET_POKEMON_BY_SEARCH = '[Pokemon] Get Pokemon By Search',
}

export namespace PokemonActions {
  export class GetPokemonList {
    static type = Actions.GET_POKEMON_LIST;
    constructor() {}
  }

  export class SearchPokemon {
  static readonly type = '[Pokemon] Search By Term';
  constructor(public name: string) {}
}
}
