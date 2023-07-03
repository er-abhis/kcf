import { Component, OnInit, ElementRef, Inject, Input } from '@angular/core';
import { SlidesOutputData, OwlOptions } from 'ngx-owl-carousel-o';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'kcf-slider',
  templateUrl: './slider-owl.component.html',
  styleUrls: ['./slider-owl.component.scss'],
})
export class SliderOwlComponent implements OnInit {
  @Input() slides: any;
  activeSlides: SlidesOutputData | undefined;

  slidesStore: any[] | undefined;

  getPassedData(data: SlidesOutputData) {
    this.activeSlides = data;
  }

  constructor() {}

  customOptions: OwlOptions = {
    center: true,
    items: 1,
    loop: true,
    nav: true,
    autoplay: false,
    autoplayTimeout: 9995000,
    autoplayHoverPause: false,
    navText: [
      '<button type="button" role="presentation" class="owl-prev"><span aria-label="Previous">‹</span></button>',
      '<button type="button" role="presentation" class="owl-next"><span aria-label="Next">›</span></button>',
    ],
    responsive: {
      768: {
        items: 4,
      },
      1200: {
        items: 5,
      },
    },
  };

  ngOnInit(): void {}
}
