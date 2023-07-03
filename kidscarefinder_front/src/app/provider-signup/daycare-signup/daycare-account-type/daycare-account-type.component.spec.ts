import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareAccountTypeComponent } from './daycare-account-type.component';

describe('DaycareAccountTypeComponent', () => {
  let component: DaycareAccountTypeComponent;
  let fixture: ComponentFixture<DaycareAccountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareAccountTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareAccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
