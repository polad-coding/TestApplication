import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderViewModel } from '../view-models/order-view-model';
import { AppSettingsService } from './app-settings.service';

@Injectable()
export class CouponService {
  private url: string = AppSettingsService.CURRENT_DOMAIN;

  constructor(private http: HttpClient) { }

  public CheckIfAllCouponsAreValid(listOfOrders: Array<OrderViewModel>) {
    return this.http.post(`https://${this.url}/Coupon/CheckIfAllCouponsAreValid`, listOfOrders, { observe: 'response' });
  }

  public GetCoupon(couponBody: string) {
    return this.http.get(`https://${this.url}/Coupon/GetCoupon?couponBody=${couponBody}`, { observe: 'response' });
  }
}
