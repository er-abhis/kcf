import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherChildComponent } from './teacher-child.component';

describe('TeacherChildComponent', () => {
  let component: TeacherChildComponent;
  let fixture: ComponentFixture<TeacherChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherChildComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
