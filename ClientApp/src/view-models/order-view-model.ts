export class OrderViewModel {

  public id: number;
  public numberOfCodes: number;
  public numberOfSurveys: number;
  public pricePerUnit: number;
  public discountCoupon: string;
  public totalPrice: number;
  public defaultNumberOfUsages: number;

  constructor(id, numberOfCodes, numberOfSurveys, pricePerUnit, discoutCoupon, totalPrice, defaultNumberOfUsages) {
    this.id = id;
    this.numberOfCodes = numberOfCodes;
    this.numberOfSurveys = numberOfSurveys;
    this.pricePerUnit = pricePerUnit;
    this.discountCoupon = discoutCoupon;
    this.totalPrice = totalPrice;
    this.defaultNumberOfUsages = defaultNumberOfUsages;
  }

}
