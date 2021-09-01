import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderViewModel } from '../view-models/order-view-model';
import { TransferCodesViewModel } from '../view-models/transfer-codes-view-model';
import { AppSettingsService } from './app-settings.service';

@Injectable()
export class OrderService {

  private url: string = AppSettingsService.CURRENT_DOMAIN;

  constructor(private http: HttpClient) { }

  public GenerateOrdersForTheUser(codesList: Array<OrderViewModel>) {
    return this.http.post(`https://${this.url}/Order/GenerateOrders`, codesList, { observe: 'response' });
  }

  public CheckIfCodeIsValid(code: string) {
    return this.http.get(`https://${this.url}/Order/CheckIfCodeIsValid?code=${code}`, { observe: 'response' });
  }

  public TransferTheCode(transferCodesViewModel: TransferCodesViewModel) {
    return this.http.post(`https://${this.url}/Order/TransferTheCode`, transferCodesViewModel, { observe: 'response' });
  }

  public DeleteAllOrdersOfTheCurrentUser() {
    return this.http.post(`https://${this.url}/Order/DeleteAllOrdersOfTheCurrentUser`, { observe: 'response' });
  }

}
