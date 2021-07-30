import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageViewModel } from "../view-models/message-view-model";
import { OrderViewModel } from "../view-models/order-view-model";
import { SendOrderReceiptViewModel } from "../view-models/send-orders-receipt-view-model";
import { AppSettingsService } from "./app-settings.service";

@Injectable()
export class EmailSenderService {
  private url: string = AppSettingsService.CURRENT_DOMAIN;


  constructor(private http: HttpClient) { }

  //  Task<List<ValueModel>> GetValuesForFirstStageAsync(int surveyId);
  //Task < List < ValueModel >> GetFirstStageValuesAsync(int surveyId);
  //Task < List < ValueModel >> GetSecondStageValuesAsync(int surveyId);

  public SendReciept(messages: Array<MessageViewModel>) {
    return this.http.post(`https://${this.url}/EmailSender/SendReciept`, messages, { observe: "response" });
  }

  public SendReceipts(sendOrderRecieptViewModel: SendOrderReceiptViewModel) {
    return this.http.post(`https://${this.url}/EmailSender/SendReceipts`, sendOrderRecieptViewModel, { observe: 'response' });
  }

  public SendMembershipRenewalReceipt() {
    return this.http.get(`https://${this.url}/EmailSender/SendMembershipRenewalReceipt`, { observe: 'response' });
  }
}
