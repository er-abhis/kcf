import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreschoolComponent } from './preschool.component';

describe('PreschoolComponent', () => {
  let component: PreschoolComponent;
  let fixture: ComponentFixture<PreschoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreschoolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreschoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
