export class MessageViewModel {
  public to: Array<string>;
  public subject: string;
  public content: string;

  constructor(to, subject, content) {
    this.to = to;
    this.subject = subject;
    this.content = content;
  }
}
