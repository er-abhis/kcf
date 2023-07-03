import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFAQSSidebarComponent } from './user-faqs-sidebar.component';

describe('UserFAQSSidebarComponent', () => {
  let component: UserFAQSSidebarComponent;
  let fixture: ComponentFixture<UserFAQSSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFAQSSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFAQSSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
