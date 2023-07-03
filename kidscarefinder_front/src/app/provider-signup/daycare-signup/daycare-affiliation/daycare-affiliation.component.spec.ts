import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareAffiliationComponent } from './daycare-affiliation.component';

describe('DaycareAffiliationComponent', () => {
  let component: DaycareAffiliationComponent;
  let fixture: ComponentFixture<DaycareAffiliationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareAffiliationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareAffiliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
