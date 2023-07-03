import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWaitlistComponent } from './manage-waitlist.component';

describe('ManageWaitlistComponent', () => {
  let component: ManageWaitlistComponent;
  let fixture: ComponentFixture<ManageWaitlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageWaitlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageWaitlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
