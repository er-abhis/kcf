// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { Slick } from 'ngx-slickjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-slick-carousel',
  templateUrl: './slick-carousel.component.html',
  styleUrls: ['./slick-carousel.component.scss'],
})
export class SlickCarouselComponent implements OnInit {
  @Input() slides: any;
  arrayLength = 14;

  config: Slick.Config = {
    centerMode: true,
    centerPadding: '50px',
    autoplay: false,
    dots: true,
    speed: 1000,
    slidesToShow: 5,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      // {
      //   breakpoint: 800,
      //   settings: 'unslick',
      // },
    ],
  };

  getArray(count: number) {
    return new Array(count);
  }
  constructor(private router: Router) {}

  ngOnInit(): void {}
  getUrl(item: any) {
    switch (item.title) {
      case 'Preschool':
        this.router.navigateByUrl('/preschool');
        break;
      // case 'Babysitter':
      //   this.router.navigateByUrl('/babysitter');
      //   break;
    }
  }
}
