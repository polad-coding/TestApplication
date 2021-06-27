import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
  host: {
    '(document:click)': 'DocumentClicked()',
  }
})
export class NavigationBarComponent implements OnInit, AfterViewInit {

  public isMobile: boolean = false;
  public actionsSideBarIsVisible: boolean = false;
  public languagesSideBarIsVisible: boolean = false;

  constructor(private _router: Router) { }

  ngAfterViewInit(): void {
    if (window.innerWidth < 768) {
      this.isMobile = true;
    }
    else {
      this.isMobile = false;
    }
  }

  ngOnInit() {
    if (window.innerWidth < 768) {
      this.isMobile = true;
    }
    else {
      this.isMobile = false;
    }
  }

  public RedirectToPractitionersDirectory() {
    this._router.navigate(['practitionersDirectory']);
  }

  public DocumentClicked() {
    this.actionsSideBarIsVisible = false;
    this.languagesSideBarIsVisible = false;
  }

  public DisplayActionsSideBar(event: MouseEvent)
  {
    event.stopPropagation();
    this.actionsSideBarIsVisible = true;
  }

  public DisplayLanguagesSideBar(event: MouseEvent) {
    event.stopPropagation();
    this.languagesSideBarIsVisible = true;
  }

  public LanguagesSideBarClick(event: MouseEvent) {
    event.stopPropagation();
  }

  public ActionsSideBarClick(event: MouseEvent) {
    event.stopPropagation();
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    if (window.innerWidth < 768) {
      this.isMobile = true;
    }
    else {
      this.isMobile = false;
    }
  }



}
