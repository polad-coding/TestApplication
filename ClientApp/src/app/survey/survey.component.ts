import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  constructor(private _router: Router) { }

  public RedirectToEnterCodePage() {
    this._router.navigate(['enterCode']);
  }

  ngOnInit() {
    localStorage.setItem('currentTabName', 'survey');
    window.scroll(0, 0);
  }

}
