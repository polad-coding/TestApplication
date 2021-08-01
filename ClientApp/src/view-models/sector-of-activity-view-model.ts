export class SectorOfActivityViewModel {
  public id: number;
  public sectorOfActivityName: string;

  constructor(id: number, sectorOfActivity: string) {
    this.id = id;
    this.sectorOfActivityName = sectorOfActivity;
  }
}
