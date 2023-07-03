import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareAdminAddComponent } from './daycare-admin-add.component';

describe('DaycareAdminAddComponent', () => {
  let component: DaycareAdminAddComponent;
  let fixture: ComponentFixture<DaycareAdminAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareAdminAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareAdminAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
