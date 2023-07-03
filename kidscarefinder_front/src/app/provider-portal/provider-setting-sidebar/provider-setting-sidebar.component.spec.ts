import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderSettingSidebarComponent } from './provider-setting-sidebar.component';

describe('ProviderSettingSidebarComponent', () => {
  let component: ProviderSettingSidebarComponent;
  let fixture: ComponentFixture<ProviderSettingSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderSettingSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderSettingSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
