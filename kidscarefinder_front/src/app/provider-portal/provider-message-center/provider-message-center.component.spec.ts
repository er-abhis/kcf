import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderMessageCenterComponent } from './provider-message-center.component';

describe('ProviderMessageCenterComponent', () => {
  let component: ProviderMessageCenterComponent;
  let fixture: ComponentFixture<ProviderMessageCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderMessageCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderMessageCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
