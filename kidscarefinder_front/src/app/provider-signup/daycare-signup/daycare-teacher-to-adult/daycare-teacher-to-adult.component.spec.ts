import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareTeacherToAdultComponent } from './daycare-teacher-to-adult.component';

describe('DaycareTeacherToAdultComponent', () => {
  let component: DaycareTeacherToAdultComponent;
  let fixture: ComponentFixture<DaycareTeacherToAdultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareTeacherToAdultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareTeacherToAdultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
