export enum Actions {
  GET_POKEMON_DETAILS = '[PokemonDetails] Get Pokemon Details',
  GET_POKEMON_RARITY = '[PokemonDetails] Get Pokemon rarity',
}

export namespace PokemonDetailsActions {
  export class PokemonDetailsAction {
    public static readonly type = Actions.GET_POKEMON_DETAILS;
    constructor(public name: string) {}
  }

  export class GetRarity {
    static type = Actions.GET_POKEMON_RARITY;
    constructor(public name: string) {}
  }
}