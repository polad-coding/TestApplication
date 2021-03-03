import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, QueryList, Renderer2, SimpleChanges, ViewChildren } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

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
  public slidesNoVisible: number = 4;
  public currentIndex: number = this.slidesNoVisible;
  public lastSlideIndex: number;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
      this.lastSlideIndex = this.slides.length;

      this.slides.forEach((e, index) => {
        if ((index >= (this.currentIndex - this.slidesNoVisible)) && (index < this.currentIndex)) {
          this.renderer.setStyle(e.nativeElement, 'display', 'flex');
        }
        else {
          this.renderer.setStyle(e.nativeElement, 'display', 'none');
        }
      });
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
    
  }

}
