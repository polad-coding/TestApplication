export class EmailMessageToPractitionerViewModel {
  public practitionerId: string;
  public messageContent: string;
  public messageSubject: string;

  constructor(practitionerId, messageSubject, messageContent) {
    this.practitionerId = practitionerId;
    this.messageSubject = messageSubject;
    this.messageContent = messageContent;
  }
}
