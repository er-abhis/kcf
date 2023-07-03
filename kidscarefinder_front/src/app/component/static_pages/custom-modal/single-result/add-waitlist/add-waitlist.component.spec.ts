import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWaitlistComponent } from './add-waitlist.component';

describe('AddWaitlistComponent', () => {
  let component: AddWaitlistComponent;
  let fixture: ComponentFixture<AddWaitlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWaitlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWaitlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
