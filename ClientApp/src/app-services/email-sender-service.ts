import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CodeTransferEmailViewModel } from "../view-models/code-transfer-email-view-model";
import { EmailMessageToPractitionerViewModel } from "../view-models/email-message-to-practitioner-view-model";
import { MessageViewModel } from "../view-models/message-view-model";
import { SendOrderReceiptViewModel } from "../view-models/send-orders-receipt-view-model";
import { AppSettingsService } from "./app-settings.service";

@Injectable()
export class EmailSenderService {
  private url: string = AppSettingsService.CURRENT_DOMAIN;

  constructor(private http: HttpClient) { }

  public SendReciept(messages: Array<MessageViewModel>) {
    return this.http.post(`https://${this.url}/EmailSender/SendReciept`, messages, { observe: "response" });
  }

  public SendReceipts(sendOrderRecieptViewModel: SendOrderReceiptViewModel) {
    return this.http.post(`https://${this.url}/EmailSender/SendReceipts`, sendOrderRecieptViewModel, { observe: 'response' });
  }

  public SendMembershipRenewalReceipt() {
    return this.http.get(`https://${this.url}/EmailSender/SendMembershipRenewalReceipt`, { observe: 'response' });
  }

  public SendMessageToPractitioner(emailMessageToPractitioner: EmailMessageToPractitionerViewModel) {
    return this.http.post(`https://${this.url}/EmailSender/SendMessageToPractitioner`, emailMessageToPractitioner, { observe: 'response' });
  }

  public EmailUserAboutNewCodeTransfered(emailCodelinkViewModel: CodeTransferEmailViewModel) {
    return this.http.post(`https://${this.url}/EmailSender/EmailUserAboutNewCodeTransfered`, emailCodelinkViewModel, { observe: 'response' });
  }
}
