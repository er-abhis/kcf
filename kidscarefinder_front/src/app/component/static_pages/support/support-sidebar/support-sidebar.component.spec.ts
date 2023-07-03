import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportSidebarComponent } from './support-sidebar.component';

describe('SupportSidebarComponent', () => {
  let component: SupportSidebarComponent;
  let fixture: ComponentFixture<SupportSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
