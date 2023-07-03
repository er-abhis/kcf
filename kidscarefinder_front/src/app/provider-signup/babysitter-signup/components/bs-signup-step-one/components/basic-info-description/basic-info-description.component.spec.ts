import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfoDescriptionComponent } from './basic-info-description.component';

describe('BasicInfoDescriptionComponent', () => {
  let component: BasicInfoDescriptionComponent;
  let fixture: ComponentFixture<BasicInfoDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicInfoDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicInfoDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
