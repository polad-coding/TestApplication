import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../app-services/account.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [AccountService]
})
export class TestComponent implements OnInit {

  public responseBody: string = "Empty";

  constructor(private as: AccountService) { }

  ngOnInit() {
  }

  public TestRequest() {
    this.as.TestRequest().subscribe((response: any) => {
      this.responseBody = response.body;
    })
  }

}
