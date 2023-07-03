import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsSignupSidebarComponent } from './bs-signup-sidebar.component';

describe('BsSignupSidebarComponent', () => {
  let component: BsSignupSidebarComponent;
  let fixture: ComponentFixture<BsSignupSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BsSignupSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BsSignupSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
