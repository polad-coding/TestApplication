import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin-form',
  templateUrl: './signin-form.component.html',
  styleUrls: ['./signin-form.component.css']
})
export class SigninFormComponent implements OnInit {

  public surveyCode: string = "AVKSI78";

  constructor() {
  }

  ngOnInit() {
  }

}
