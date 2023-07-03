import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDetailsSidebarComponent } from './update-details-sidebar.component';

describe('UpdateDetailsSidebarComponent', () => {
  let component: UpdateDetailsSidebarComponent;
  let fixture: ComponentFixture<UpdateDetailsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDetailsSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDetailsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
