import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('1000ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChildren("slide")
  public slides: QueryList<ElementRef>;
  public slidesNoVisible: number = 1;
  public currentIndex: number = 1;
  public lastSlideIndex: number;

  public currentWidth: number = window.innerWidth;

  constructor(private renderer: Renderer2, private _router: Router) { }

  ngAfterViewInit(): void {
    this.lastSlideIndex = this.slides.length;
    document.getElementById('kp-main-page-slideshow-container').style.display = 'flex';

    this.onResize(null);
  }

  public RedirectToSurveyPage() {
    this._router.navigate(['survey']);
  }

  public RedirectToPractitionersDirectoryPage() {
    this._router.navigate(['practitionersDirectory']);
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    if (window.innerWidth >= 1304) {
      this.slidesNoVisible = 4;
      this.currentIndex = 4;
    }
    else if (window.innerWidth <= 1304 && window.innerWidth > 650) {
      this.slidesNoVisible = 3;
      this.currentIndex = 3;
    }
    else if (window.innerWidth <= 650 && window.innerWidth > 430) {
      this.slidesNoVisible = 2;
      this.currentIndex = 2;
    }
    else {
      this.slidesNoVisible = 1;
      this.currentIndex = 1;
    }

    this.DisplayNewSlides();
  }

  public DisplayNewSlides() {
    if (this.slides == undefined) {
      return;
    }

    this.slides.forEach((e, index) => {
      if ((index >= (this.currentIndex - this.slidesNoVisible)) && (index < this.currentIndex)) {
        this.renderer.setStyle(e.nativeElement, 'display', 'flex');
        return;
      }

      this.renderer.setStyle(e.nativeElement, 'display', 'none');
    });

  }

  public GoRight() {
    if (this.currentIndex != this.slidesNoVisible) {
      this.currentIndex--;
      this.DisplayNewSlides();
    }
  }

  public GoLeft() {
    if (this.currentIndex < this.lastSlideIndex) {
      this.currentIndex++;
      this.DisplayNewSlides();
    }
  }

  ngOnInit() {
    localStorage.removeItem('currentNavigationBarTabName');

    this.onResize(null);
  }

}
