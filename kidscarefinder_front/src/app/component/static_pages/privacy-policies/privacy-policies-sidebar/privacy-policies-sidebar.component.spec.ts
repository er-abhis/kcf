import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPoliciesSidebarComponent } from './privacy-policies-sidebar.component';

describe('PrivacyPoliciesSidebarComponent', () => {
  let component: PrivacyPoliciesSidebarComponent;
  let fixture: ComponentFixture<PrivacyPoliciesSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyPoliciesSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyPoliciesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
