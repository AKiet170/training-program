export enum Actions {
  GET_POKEMON_LIST = '[Pokemon] Get Pokemon List',
  GET_POKEMON_BY_SEARCH = '[Pokemon] Get Pokemon By Search',
  GET_POKEMON_RARITY = '[Pokemon] Get pokemon rarity',
  GET_FAVORITE_LIST = '[Pokemon] Get favorite list',
  CHANGE_PAGE = '[Pokemon] Change page'
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
  export class GetPokemonDetails {
    static readonly type = '[Pokemon] Get Details (For Modal)';
    constructor(public name: string) {}
  }

  export class GetFavoriteList {
    static type = Actions.GET_FAVORITE_LIST;
    constructor () {}
  }

  export class ChangePage {
  CHANGE_PAGE = '[Pokemon] Change page'
    static readonly type = Actions.CHANGE_PAGE;
    constructor(public pageIndex: number) {}
  }
}
