import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleResultsComponent } from './single-results.component';

describe('SingleResultsComponent', () => {
  let component: SingleResultsComponent;
  let fixture: ComponentFixture<SingleResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
