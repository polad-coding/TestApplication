export class OrderViewModel {

  public id: number;
  public numberOfCodes: number;
  public numberOfUsages: number;
  public pricePerUnit: number;
  public couponBody: string;
  public totalPrice: number;
  public defaultNumberOfUsages: number;
  public discountRate: number;
  public codeBody: string;

  constructor(id, numberOfCodes, numberOfSurveys, pricePerUnit, discoutCoupon, totalPrice, defaultNumberOfUsages) {
    this.id = id;
    this.numberOfCodes = numberOfCodes;
    this.numberOfUsages = numberOfSurveys;
    this.pricePerUnit = pricePerUnit;
    this.couponBody = discoutCoupon;
    this.totalPrice = totalPrice;
    this.defaultNumberOfUsages = defaultNumberOfUsages;
  }

}
