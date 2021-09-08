export class CodeTransferEmailViewModel {
  public email: string;
  public subject: string;
  public message: string;
  public code: string;

  constructor(email, subject, message, code) {
    this.email = email;
    this.subject = subject;
    this.message = message;
    this.code = code;
  }
}
