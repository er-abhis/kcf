import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqsProviderSidebarComponent } from './faqs-provider-sidebar.component';

describe('FaqsProviderSidebarComponent', () => {
  let component: FaqsProviderSidebarComponent;
  let fixture: ComponentFixture<FaqsProviderSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqsProviderSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqsProviderSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
