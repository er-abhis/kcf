import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHomeDaycareBasicInfoComponent } from './in-home-daycare-basic-info.component';

describe('InHomeDaycareBasicInfoComponent', () => {
  let component: InHomeDaycareBasicInfoComponent;
  let fixture: ComponentFixture<InHomeDaycareBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InHomeDaycareBasicInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InHomeDaycareBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
