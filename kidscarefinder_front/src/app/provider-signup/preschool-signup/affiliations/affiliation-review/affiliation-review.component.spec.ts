import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliationReviewComponent } from './affiliation-review.component';

describe('AffiliationReviewComponent', () => {
  let component: AffiliationReviewComponent;
  let fixture: ComponentFixture<AffiliationReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffiliationReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffiliationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
