import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPublicPageComponent } from './user-public-page.component';

describe('UserPublicPageComponent', () => {
  let component: UserPublicPageComponent;
  let fixture: ComponentFixture<UserPublicPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPublicPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPublicPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
