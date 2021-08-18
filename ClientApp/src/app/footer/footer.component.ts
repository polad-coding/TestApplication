import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
  }
}
