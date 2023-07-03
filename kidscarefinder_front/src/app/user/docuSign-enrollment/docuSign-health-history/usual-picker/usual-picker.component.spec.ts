import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsualPickerComponent } from './usual-picker.component';

describe('UsualPickerComponent', () => {
  let component: UsualPickerComponent;
  let fixture: ComponentFixture<UsualPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsualPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsualPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
