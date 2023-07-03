import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPerfrencesComponent } from './application-perfrences.component';

describe('ApplicationPerfrencesComponent', () => {
  let component: ApplicationPerfrencesComponent;
  let fixture: ComponentFixture<ApplicationPerfrencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationPerfrencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationPerfrencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
