import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsSidebarComponent } from './about-us-sidebar.component';

describe('AboutUsSidebarComponent', () => {
  let component: AboutUsSidebarComponent;
  let fixture: ComponentFixture<AboutUsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutUsSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
