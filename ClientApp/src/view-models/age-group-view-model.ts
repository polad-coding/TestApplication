export class AgeGroupViewModel {
  public id: number;
  public groupAgeRange: string;

  constructor(id: number, groupAgeRange: string) {
    this.id = id;
    this.groupAgeRange = groupAgeRange;
  }
}
