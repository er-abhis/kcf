import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabysitterSignupFormComponent } from './babysitter-signup-form.component';

describe('BabysitterSignupComponent', () => {
  let component: BabysitterSignupFormComponent;
  let fixture: ComponentFixture<BabysitterSignupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BabysitterSignupFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BabysitterSignupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
