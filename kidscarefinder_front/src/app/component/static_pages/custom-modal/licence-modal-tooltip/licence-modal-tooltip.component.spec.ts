import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceModalTooltipComponent } from './licence-modal-tooltip.component';

describe('LicenceModalTooltipComponent', () => {
  let component: LicenceModalTooltipComponent;
  let fixture: ComponentFixture<LicenceModalTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenceModalTooltipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenceModalTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
