import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedPersonComponent } from './authorized-person.component';

describe('AuthorizedPersonComponent', () => {
  let component: AuthorizedPersonComponent;
  let fixture: ComponentFixture<AuthorizedPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizedPersonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizedPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
