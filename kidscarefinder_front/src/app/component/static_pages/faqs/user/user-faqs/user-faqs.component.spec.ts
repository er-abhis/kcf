import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFaqsComponent } from './user-faqs.component';

describe('UserFaqsComponent', () => {
  let component: UserFaqsComponent;
  let fixture: ComponentFixture<UserFaqsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFaqsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFaqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
