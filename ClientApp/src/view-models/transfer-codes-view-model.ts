export class TransferCodesViewModel {
  public code: string;
  public userId: string;

  constructor(code: string, userId: string) {
    this.code = code;
    this.userId = userId;
  }
}
