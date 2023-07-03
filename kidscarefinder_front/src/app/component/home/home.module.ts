import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderOwlComponent } from './slider-owl/slider-owl.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RouterModule } from '@angular/router';
import {  NgxSlickJsModule } from 'ngx-slickjs'
import {SlickCarouselComponent} from "./slick-carousel/slick-carousel.component";

@NgModule({
  declarations: [
    SliderOwlComponent,
    SlickCarouselComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    RouterModule,
    NgxSlickJsModule.forRoot({
      links: {
        jquery: "https://code.jquery.com/jquery-3.4.0.min.js",
        slickJs: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js",
        slickCss: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css",
        slickThemeCss: "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"
      }
    })
  ],
  exports: [
    SliderOwlComponent,
    SlickCarouselComponent
  ],
})


export class HomeModule { }
