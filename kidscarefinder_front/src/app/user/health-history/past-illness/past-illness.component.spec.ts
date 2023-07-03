import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastIllnessComponent } from './past-illness.component';

describe('PastIllnessComponent', () => {
  let component: PastIllnessComponent;
  let fixture: ComponentFixture<PastIllnessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastIllnessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastIllnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
