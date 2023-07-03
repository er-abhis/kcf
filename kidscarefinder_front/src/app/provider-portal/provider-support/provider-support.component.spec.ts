import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderSupportComponent } from './provider-support.component';

describe('ProviderSupportComponent', () => {
  let component: ProviderSupportComponent;
  let fixture: ComponentFixture<ProviderSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderSupportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
