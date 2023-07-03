import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderFAQsComponent } from './provider-faqs.component';

describe('ProviderFAQsComponent', () => {
  let component: ProviderFAQsComponent;
  let fixture: ComponentFixture<ProviderFAQsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderFAQsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderFAQsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
