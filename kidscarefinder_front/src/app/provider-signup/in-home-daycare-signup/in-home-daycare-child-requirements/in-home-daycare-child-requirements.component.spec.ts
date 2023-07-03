import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHomeDaycareChildRequirementsComponent } from './in-home-daycare-child-requirements.component';

describe('InHomeDaycareChildRequirementsComponent', () => {
  let component: InHomeDaycareChildRequirementsComponent;
  let fixture: ComponentFixture<InHomeDaycareChildRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InHomeDaycareChildRequirementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InHomeDaycareChildRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
