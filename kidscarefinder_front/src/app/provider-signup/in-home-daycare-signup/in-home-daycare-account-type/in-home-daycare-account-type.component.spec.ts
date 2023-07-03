import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHomeDaycareAccountTypeComponent } from './in-home-daycare-account-type.component';

describe('InHomeDaycareAccountTypeComponent', () => {
  let component: InHomeDaycareAccountTypeComponent;
  let fixture: ComponentFixture<InHomeDaycareAccountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InHomeDaycareAccountTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InHomeDaycareAccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
