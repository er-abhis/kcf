import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoboTopMenuComponent } from './mobo-top-menu.component';

describe('MoboTopMenuComponent', () => {
  let component: MoboTopMenuComponent;
  let fixture: ComponentFixture<MoboTopMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoboTopMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoboTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
