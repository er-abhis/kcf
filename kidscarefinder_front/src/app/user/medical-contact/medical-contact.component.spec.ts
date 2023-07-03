import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalContactComponent } from './medical-contact.component';

describe('MedicalContactComponent', () => {
  let component: MedicalContactComponent;
  let fixture: ComponentFixture<MedicalContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
