export class OrderViewModel {

  public numberOfCodes: number;
  public numberOfSurveys: number;
  public pricePerUnit: number;
  public discountCoupon: string;
  public totalPrice: number;

  constructor(numberOfCodes, numberOfSurveys, pricePerUnit, discoutCoupon, totalPrice) {
    this.numberOfCodes = numberOfCodes;
    this.numberOfSurveys = numberOfSurveys;
    this.pricePerUnit = pricePerUnit;
    this.discountCoupon = this.discountCoupon;
    this.totalPrice = totalPrice;
  }

}
