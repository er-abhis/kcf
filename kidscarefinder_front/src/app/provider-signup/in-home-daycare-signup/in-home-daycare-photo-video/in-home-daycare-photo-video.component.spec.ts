import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHomeDaycarePhotoVideoComponent } from './in-home-daycare-photo-video.component';

describe('InHomeDaycarePhotoVideoComponent', () => {
  let component: InHomeDaycarePhotoVideoComponent;
  let fixture: ComponentFixture<InHomeDaycarePhotoVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InHomeDaycarePhotoVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InHomeDaycarePhotoVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
