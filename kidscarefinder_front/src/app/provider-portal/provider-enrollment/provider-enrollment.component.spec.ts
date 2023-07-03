import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderEnrollmentComponent } from './provider-enrollment.component';

describe('ProviderEnrollmentComponent', () => {
  let component: ProviderEnrollmentComponent;
  let fixture: ComponentFixture<ProviderEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderEnrollmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
