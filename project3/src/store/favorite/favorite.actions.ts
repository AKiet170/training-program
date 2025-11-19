export class FavoriteAction {
  public static readonly type = '[Favorite] Add item';
  constructor(public payload: string) { }
}