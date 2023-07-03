import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderUrlComponent } from './provider-url.component';

describe('ProviderUrlComponent', () => {
  let component: ProviderUrlComponent;
  let fixture: ComponentFixture<ProviderUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderUrlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
