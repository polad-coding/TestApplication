import { AfterViewInit, Component, ElementRef, HostListener, OnChanges, OnInit, QueryList, Renderer2, SimpleChanges, ViewChildren } from '@angular/core';
import {
  trigger,
  state,
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
  public currentWidth: number = window.innerWidth;
  public slidesNoVisible: number = 4;
  public currentIndex: number = this.slidesNoVisible;
  public lastSlideIndex: number;

  constructor(private renderer: Renderer2, private _router: Router) { }

  ngAfterViewInit(): void {
    this.lastSlideIndex = this.slides.length;
    if (window.innerWidth >= 1304) {
      this.slidesNoVisible = 4;
    }
    else if (window.innerWidth <= 1304 && window.innerWidth > 650) {
      this.slidesNoVisible = 3;
    }
    else if (window.innerWidth <= 650 && window.innerWidth > 430) {
      this.slidesNoVisible = 2;
    }
    else {
      this.slidesNoVisible = 1;
    }
    this.DisplayNewSlides();
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
      this.DisplayNewSlides();

    }
    else if (window.innerWidth <= 1304 && window.innerWidth > 650) {
      this.slidesNoVisible = 3;
      this.DisplayNewSlides();

    }
    else if (window.innerWidth <= 650 && window.innerWidth > 430) {
      this.slidesNoVisible = 2;
      this.DisplayNewSlides();

    }
    else {
      this.slidesNoVisible = 1;
      this.DisplayNewSlides();

    }
  }

  public DisplayNewSlides() {
    this.slides.forEach((e, index) => {
      if ((index >= (this.currentIndex - this.slidesNoVisible)) && (index < this.currentIndex)) {
        this.renderer.setStyle(e.nativeElement, 'display', 'flex');
      }
      else {
        this.renderer.setStyle(e.nativeElement, 'display', 'none');
      }
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
    localStorage.removeItem('currentTabName');
  }

}
