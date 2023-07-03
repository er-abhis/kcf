import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoVideoComponent } from './photo-video.component';

describe('PhotoVideoComponent', () => {
  let component: PhotoVideoComponent;
  let fixture: ComponentFixture<PhotoVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
