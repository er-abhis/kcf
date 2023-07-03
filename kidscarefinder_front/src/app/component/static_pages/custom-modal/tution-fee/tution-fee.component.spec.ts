import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutionFeeComponent } from './tution-fee.component';

describe('TutionFeeComponent', () => {
  let component: TutionFeeComponent;
  let fixture: ComponentFixture<TutionFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutionFeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutionFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
