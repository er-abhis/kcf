import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHomeDaycareAdminSettingComponent } from './in-home-daycare-admin-setting.component';

describe('InHomeDaycareAdminSettingComponent', () => {
  let component: InHomeDaycareAdminSettingComponent;
  let fixture: ComponentFixture<InHomeDaycareAdminSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InHomeDaycareAdminSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InHomeDaycareAdminSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
