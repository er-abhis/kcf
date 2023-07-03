import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UsualTimePickerInputComponent} from './usual-time-picker-input.component';

describe('UsualTimePickerInputComponent', () => {
  let component: UsualTimePickerInputComponent;
  let fixture: ComponentFixture<UsualTimePickerInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsualTimePickerInputComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UsualTimePickerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
