import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderOwlComponent } from './slider-owl.component';

describe('SliderOwlComponent', () => {
  let component: SliderOwlComponent;
  let fixture: ComponentFixture<SliderOwlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderOwlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
