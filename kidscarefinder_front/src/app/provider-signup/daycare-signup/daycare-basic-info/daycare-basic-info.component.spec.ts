import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareBasicInfoComponent } from './daycare-basic-info.component';

describe('DaycareBasicInfoComponent', () => {
  let component: DaycareBasicInfoComponent;
  let fixture: ComponentFixture<DaycareBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareBasicInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
