import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, AfterViewInit {

  public microFooterIsVisible: boolean = false;
  public miniFooterIsVisible: boolean = false;
  public mediumFooterIsVisible: boolean = false;
  public fullFooterIsVisible: boolean = false;

  constructor() { }

  ngAfterViewInit(): void {
    this.AdjustFooterSize();
  }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    this.AdjustFooterSize();
  }

  public AdjustFooterSize() {
    if (window.innerWidth <= 768 && window.innerWidth > 695) {
      this.mediumFooterIsVisible = true;
      this.miniFooterIsVisible = false;
      this.microFooterIsVisible = false;
      this.fullFooterIsVisible = false;
    }
    else if (window.innerWidth <= 695 && window.innerWidth > 440) {
      this.mediumFooterIsVisible = false;
      this.miniFooterIsVisible = true;
      this.fullFooterIsVisible = false;
      this.microFooterIsVisible = false;

    }
    else if (window.innerWidth <= 440) {
      this.mediumFooterIsVisible = false;
      this.miniFooterIsVisible = false;
      this.fullFooterIsVisible = false;
      this.microFooterIsVisible = true;
    }
    else {
      this.mediumFooterIsVisible = false;
      this.miniFooterIsVisible = false;
      this.fullFooterIsVisible = true;
      this.microFooterIsVisible = false;
    }
  }

}
