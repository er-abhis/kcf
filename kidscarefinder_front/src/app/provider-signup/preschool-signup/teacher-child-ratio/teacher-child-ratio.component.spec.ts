import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherChildRatioComponent } from './teacher-child-ratio.component';

describe('TeacherChildRatioComponent', () => {
  let component: TeacherChildRatioComponent;
  let fixture: ComponentFixture<TeacherChildRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherChildRatioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherChildRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
