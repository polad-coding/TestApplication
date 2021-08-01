export class PositionViewModel {
  public id: number;
  public positionName: string;

  constructor(id: number, positionName: string) {
    this.id = id;
    this.positionName = positionName;
  }
}
