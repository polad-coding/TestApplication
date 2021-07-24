export class SendOrderReceiptViewModel {
  public totalPriceString: string;
  public codesDictionary: { [key: string] : number };

  constructor(totalPriceString, codesDictionary) {
    this.totalPriceString = totalPriceString;
    this.codesDictionary = codesDictionary;
  }
}
