import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitlistThankyouComponent } from './waitlist-thankyou.component';

describe('WaitlistThankyouComponent', () => {
  let component: WaitlistThankyouComponent;
  let fixture: ComponentFixture<WaitlistThankyouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitlistThankyouComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitlistThankyouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
