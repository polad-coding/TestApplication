import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../app-services/account.service';
import { ValueViewModel } from '../../view-models/value-view-model';
import { render } from 'creditcardpayments/creditCardPayments';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [AccountService]
})
export class TestComponent implements OnInit {

  constructor(private as: AccountService) {
    render({
      id: "#paypalButtons",
      currency: "USD",
      value: "100.00",
      onApprove: (details) => {
        alert('success');
      }
    })
  }

  ngOnInit() {

  }

}
