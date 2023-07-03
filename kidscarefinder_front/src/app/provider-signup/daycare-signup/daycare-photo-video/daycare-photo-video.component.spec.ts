import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycarePhotoVideoComponent } from './daycare-photo-video.component';

describe('DaycarePhotoVideoComponent', () => {
  let component: DaycarePhotoVideoComponent;
  let fixture: ComponentFixture<DaycarePhotoVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycarePhotoVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycarePhotoVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
