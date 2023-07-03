import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollThankyouComponent } from './enroll-thankyou.component';

describe('EnrollThankyouComponent', () => {
  let component: EnrollThankyouComponent;
  let fixture: ComponentFixture<EnrollThankyouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollThankyouComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollThankyouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
