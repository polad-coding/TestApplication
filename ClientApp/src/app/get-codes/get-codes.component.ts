import { Component, OnInit } from '@angular/core';
import { render } from 'creditcardpayments/creditCardPayments';
import { OrderViewModel } from '../../view-models/order-view-model';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-get-codes',
  templateUrl: './get-codes.component.html',
  styleUrls: ['./get-codes.component.css']
})
export class GetCodesComponent implements OnInit {

  public isPractitioner = false;
  public value: number = 0;
  public listOfOrders: Array<OrderViewModel> = new Array<OrderViewModel>();

  constructor() {
    render({
      id: "#paypalButtons",
      currency: "USD",
      value: this.value.toString(),
      onApprove: (details) => {
        alert('success');
      }
    })
  }

  ngOnInit() {
  }

  public AddNewOrder(event) {
    this.listOfOrders.push(new OrderViewModel(1, 1, 40, undefined,40));
  }

  public DisplayCodesOptionsDropDown(event, order) {

  }

}
