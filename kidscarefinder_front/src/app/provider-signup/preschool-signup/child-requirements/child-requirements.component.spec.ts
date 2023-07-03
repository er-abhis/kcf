import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildRequirementsComponent } from './child-requirements.component';

describe('ChildRequirementsComponent', () => {
  let component: ChildRequirementsComponent;
  let fixture: ComponentFixture<ChildRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildRequirementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
