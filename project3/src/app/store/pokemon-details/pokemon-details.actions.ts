export class PokemonDetailsAction {
  public static readonly type = '[PokemonDetails] Get Pokemon Details';
  constructor(public name: string) { }
}