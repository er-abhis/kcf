import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareAdminSettingComponent } from './daycare-admin-setting.component';

describe('DaycareAdminSettingComponent', () => {
  let component: DaycareAdminSettingComponent;
  let fixture: ComponentFixture<DaycareAdminSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareAdminSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareAdminSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
