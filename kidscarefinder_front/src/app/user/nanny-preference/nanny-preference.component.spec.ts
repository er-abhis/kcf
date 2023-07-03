import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NannyPreferenceComponent } from './nanny-preference.component';

describe('NannyPreferenceComponent', () => {
  let component: NannyPreferenceComponent;
  let fixture: ComponentFixture<NannyPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NannyPreferenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NannyPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
