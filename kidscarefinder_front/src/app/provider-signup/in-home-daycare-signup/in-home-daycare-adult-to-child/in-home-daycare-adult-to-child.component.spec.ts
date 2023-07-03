import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHomeDaycareTeacherToAdultComponent } from './in-home-daycare-adult-to-child.component';

describe('InHomeDaycareTeacherToAdultComponent', () => {
  let component: InHomeDaycareTeacherToAdultComponent;
  let fixture: ComponentFixture<InHomeDaycareTeacherToAdultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InHomeDaycareTeacherToAdultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InHomeDaycareTeacherToAdultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
