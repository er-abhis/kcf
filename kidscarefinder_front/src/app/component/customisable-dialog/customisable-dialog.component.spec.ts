
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomisableDialogComponent } from './customisable-dialog.component';

describe('CustomisableDialogComponent', () => {
  let component: CustomisableDialogComponent;
  let fixture: ComponentFixture<CustomisableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomisableDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomisableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
