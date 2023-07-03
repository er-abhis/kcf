import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHomeDaycareAffiliationComponent } from './in-home-daycare-affiliation.component';

describe('InHomeDaycareAffiliationComponent', () => {
  let component: InHomeDaycareAffiliationComponent;
  let fixture: ComponentFixture<InHomeDaycareAffiliationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InHomeDaycareAffiliationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InHomeDaycareAffiliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
