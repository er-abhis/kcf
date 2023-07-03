import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentInformationComponent } from './parent-information.component';

describe('ParentInformationComponent', () => {
  let component: ParentInformationComponent;
  let fixture: ComponentFixture<ParentInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
