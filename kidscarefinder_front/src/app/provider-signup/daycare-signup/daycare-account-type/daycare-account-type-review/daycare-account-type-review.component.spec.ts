import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareAccountTypeReviewComponent } from './daycare-account-type-review.component';

describe('DaycareAccountTypeReviewComponent', () => {
  let component: DaycareAccountTypeReviewComponent;
  let fixture: ComponentFixture<DaycareAccountTypeReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareAccountTypeReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareAccountTypeReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
