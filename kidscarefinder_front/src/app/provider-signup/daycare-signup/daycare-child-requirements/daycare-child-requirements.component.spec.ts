import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareChildRequirementsComponent } from './daycare-child-requirements.component';

describe('DaycareChildRequirementsComponent', () => {
  let component: DaycareChildRequirementsComponent;
  let fixture: ComponentFixture<DaycareChildRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareChildRequirementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareChildRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
