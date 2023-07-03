import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisingSpaceComponent } from './advertising-space.component';

describe('AdvertisingSpaceComponent', () => {
  let component: AdvertisingSpaceComponent;
  let fixture: ComponentFixture<AdvertisingSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisingSpaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisingSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
