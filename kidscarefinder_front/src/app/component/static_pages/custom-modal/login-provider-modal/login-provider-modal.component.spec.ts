import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginProviderModalComponent } from './login-provider-modal.component';

describe('LoginProviderModalComponent', () => {
  let component: LoginProviderModalComponent;
  let fixture: ComponentFixture<LoginProviderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginProviderModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginProviderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
