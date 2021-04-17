import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../app-services/account.service';
import { ValueViewModel } from '../../view-models/value-view-model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [AccountService]
})
export class TestComponent implements OnInit {

  constructor(private as: AccountService) { }

  ngOnInit() {

  }

}
