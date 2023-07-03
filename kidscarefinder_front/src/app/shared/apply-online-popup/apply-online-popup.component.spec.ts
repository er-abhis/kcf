import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyOnlinePopupComponent } from './apply-online-popup.component';

describe('ApplyOnlinePopupComponent', () => {
  let component: ApplyOnlinePopupComponent;
  let fixture: ComponentFixture<ApplyOnlinePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyOnlinePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyOnlinePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
