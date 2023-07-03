import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHomeDaycareSidebarComponent } from './in-home-daycare-sidebar.component';

describe('InHomeDaycareSidebarComponent', () => {
  let component: InHomeDaycareSidebarComponent;
  let fixture: ComponentFixture<InHomeDaycareSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InHomeDaycareSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InHomeDaycareSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
