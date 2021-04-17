export class ValueViewModel {
  public id: number;
  public character: string;
  public asciiValue: number;
  public perspectiveId: number;
  public isSelected: boolean;
  public priority: number;

  constructor(id, character, ascii, persId, isSelected, priority: number) {
    this.id = id;
    this.character = character;
    this.asciiValue = ascii;
    this.perspectiveId = persId;
    this.isSelected = isSelected;
    this.priority = priority;
  }

}
