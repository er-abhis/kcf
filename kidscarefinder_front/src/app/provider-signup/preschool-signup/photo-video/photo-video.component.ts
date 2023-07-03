import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { NotificationService } from 'src/app/utills/notification.service';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';

@Component({
  selector: 'provider-step-three-component',
  templateUrl: './photo-video.component.html',
  styleUrls: ['./photo-video.component.scss'],
})
export class PhotoVideoComponent implements OnInit {
  stepCount: number = 0;
  public selectedVal = 3;
  PhotoVideoNoYes: string[] = ['Yes', 'No'];
  UploadVideoNoYes: string[] = ['Yes', 'No'];
  StepDetailVideo: string[] = ['Yes', 'No'];
  uploadFilePhotoVideo: boolean = false;
  videoUploadURL: boolean = false;
  getReview: any = [];
  msg = '';
  url: any;
  reader: any;
  isProviderPhotoSubmitted = false;
  urlSubmitted = false;
  videoUrl: any = '';
  videoSrc: any;
  is_intro_video_uploaded = false;
  profilePhoto: any;
  @Input()
  set selectedIndex(value: number) {
    this.selectedVal = value;
  }
  get selectedIndex(): number {
    return this.selectedVal;
  }
  // urlRegex = "((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";
  urlRegex =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

  @Input()
  set stepCountNumber(value: any) {
    if (this.selectedVal == 3) {
      this.stepCount = +value;
      if (value == 0 || value == 2) {
        this.getReviewDetails();
      }
    }
  }
  get stepCountNumber(): number {
    return this.stepCount;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private providerService: ProviderService,
    private localStorage: LocalstorageService,
    private sanitizer: DomSanitizer
  ) { }

  photoLogoFormGroup = this._formBuilder.group({
    option: ['', Validators.required],
    upload_files: [],
    upload_file: [],
  });

  shortIntroVideoFormGroup = this._formBuilder.group({
    video_url: ['', [Validators.pattern(this.urlRegex)]],
    uploadVideo: ['', Validators.required],
  });

  reviewStepThreeForm = this._formBuilder.group({
    stepDetailPhotoUpload: ['', Validators.required],
    stepDetailVideoUpload: ['', Validators.required],
  });

  ngOnInit(): void { }

  get urlInput(): FormControl {
    return this.shortIntroVideoFormGroup.get('video_url') as FormControl;
  }

  handleUpload(fileInput: any) {
    fileInput.click();
  }

  handle(event: any) {
  }

  introVideoChange(event: MatRadioChange, data: any) {
    if (data === 'Yes') {
      this.videoUploadURL = true;
      this.shortIntroVideoFormGroup.controls.video_url.setValidators(
        [Validators.required, Validators.pattern(this.urlRegex)]
      );
      this.shortIntroVideoFormGroup.controls.video_url.updateValueAndValidity();
    } else {
      this.shortIntroVideoFormGroup.controls.video_url.setValidators(null);
      this.shortIntroVideoFormGroup.controls.video_url.updateValueAndValidity();
      this.videoUploadURL = false;
    }
  }

  radioChange(event: MatRadioChange, data: any) {

    if (data === 'Yes') {
      this.uploadFilePhotoVideo = true;
    } else {
      this.url = '';
      this.profilePic_onNo();
      this.uploadFilePhotoVideo = false;
    }
  }

  onSelectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }

    var mimeType = event.target.files[0].type;
    if (event.target.files[0]) {
      this.photoLogoFormGroup.patchValue({
        upload_file: event.target.files[0],
      });
    }

    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      return;
    }

    this.reader = new FileReader();
    this.reader.readAsDataURL(event.target.files[0]);

    this.reader.onload = (_event: any) => {
      this.msg = '';
      this.url = this.reader.result;
    };
  }

  public delete() {
    this.url = '';
    this.reader = '';
    this.profilePicDelete();

  }
  profilePicDelete() {
    return this.providerService
      .saveProviderWebsiteInfo(
        { profile_photo: null },
        this.localStorage.getUser()?.provider_id
      )
      .subscribe({
        next: (data: any) => {
          this.profilePhoto = null;
          this.notificationService.showWarning(
            CustomAlertMessage.photoUpdate[1].message
          );
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (error: any) => {
        },
      });
  }
  profilePic_onNo() {
    return this.providerService
      .saveProviderWebsiteInfo(
        { profile_photo: null },
        this.localStorage.getUser()?.provider_id
      )
      .subscribe({
        next: (data: any) => {
          this.profilePhoto = null;


        },
        error: (error: any) => {
        },
      });
  }

  checkFormValidity(stepCount: number, callback: any) {
    switch (stepCount) {
      case 0:
        // this.shortIntroVideoFormGroup.controls.uploadVideo.patchValue(mapData.is_intro_video_uploaded==true?"Yes":"No" );
        if (this.photoLogoFormGroup.invalid) {
          this.notificationService.showError(
            CustomAlertMessage.photoVideo[0].message
          );
          return;
        }
        if (!this.url && this.uploadFilePhotoVideo) {
          this.notificationService.showError(
            CustomAlertMessage.photoVideo[1].message
          );
          return;
        } else if (
          this.uploadFilePhotoVideo &&
          this.getReview.profile_photo != this.url
        ) {
          return this.providerService
            .photo(this.photoLogoFormGroup.value.upload_file)
            .subscribe({
              next: (data: any) => {
                const resData: any = data;
                if (resData && resData.data && resData?.data?.upload_file) {
                  this.photoUploadUrlUpdate(resData?.data?.upload_file);
                }
                this.notificationService.showSuccess(
                  CustomAlertMessage.photoUpdate[0].message
                );
                callback(true);
              },
              error: (error: any) => {
                this.isProviderPhotoSubmitted = true;
                if (error?.error?.errors) {
                  this.notificationService.showError(error?.error.errors)
                }
                if (error?.error.errors && error.error.errors.upload_file[0]) {
                  this.notificationService.showError(
                    error.error.errors.upload_file
                  );

                } else {
                  this.notificationService.showError(CustomAlertMessage.photoVideo[1].message);
                }
                callback(false);
              },
            });
        } else {
          return callback(true);
        }

        break;
      case 1:
        if (!this.shortIntroVideoFormGroup.value.uploadVideo) {
          this.notificationService.showError(CustomAlertMessage.photoVideo[0].message);
          return;
        }
        let dataToSend: any = {
          is_photo_uploaded: this.url ? true : false,
          is_intro_video_uploaded:
            this.shortIntroVideoFormGroup?.value?.uploadVideo === 'Yes'
              ? true
              : false,
        };
        this.urlSubmitted = true;
        if (
          this.shortIntroVideoFormGroup?.value?.uploadVideo === 'Yes' &&
          this.shortIntroVideoFormGroup.invalid
        ) {
          return;
        }
        if (this.shortIntroVideoFormGroup?.value?.uploadVideo === 'Yes') {
          dataToSend.video_url =
            this.shortIntroVideoFormGroup?.value?.video_url;
        }
        if (this.shortIntroVideoFormGroup?.value?.uploadVideo === 'No') {
          dataToSend.video_url = "";
        }
        if (
          this.shortIntroVideoFormGroup?.value?.uploadVideo === 'Yes' &&
          dataToSend.video_url == ''
        ) {
          this.notificationService.showWarning(CustomAlertMessage.photoVideo[2].message);
          return;
        }

        return this.providerService.video(dataToSend).subscribe({
          next: (data: any) => {
            const resData: any = data;
            callback(true);
          },
          error: (error: any) => {

            if (error?.error.errors) {
              this.notificationService.showError(error?.error.errors);

            } else {
              this.notificationService.showError('Some Error occured');
            }
            callback(false);
          },
        });
        break;
      default:
        callback(true);
    }

    // return callback(true);
  }

  youtubeUrlChecker(url: any) {
    var match = url.match(this.urlRegex);
    let src: any = url;
    if (match && match[2].length == 11) {
      // Do anything for being valid
      // if need to change the url to embed url then use below line
      src = 'https://www.youtube.com/embed/' + match[2];
      src = this.sanitizer.bypassSecurityTrustResourceUrl(src);
      this.videoSrc = src;
    }
  }

  getReviewDetails() {
    this.providerService.videoPhoto().subscribe({
      next: (data: any) => {
        let mapData = data?.data;
        this.getReview = mapData;
        if (mapData.is_intro_video_uploaded != null)
          this.is_intro_video_uploaded = mapData.is_intro_video_uploaded;
        if (mapData.is_intro_video_uploaded != null)
          this.shortIntroVideoFormGroup.controls.uploadVideo.patchValue(
            mapData.is_intro_video_uploaded == true ? 'Yes' : 'No'
          );
        if (mapData.is_photo_uploaded != null)
          this.photoLogoFormGroup.controls.option.patchValue(
            mapData.is_photo_uploaded == true ? 'Yes' : 'No'
          );

        if (
          mapData.is_intro_video_uploaded != null &&
          mapData.is_intro_video_uploaded
        ) {
          this.videoUploadURL = true;
          this.shortIntroVideoFormGroup
            .get('video_url')
            ?.setValue(mapData.video_url);
          this.videoUrl = mapData.video_url;
          this.youtubeUrlChecker(this.videoUrl);
        }
        if (mapData.is_photo_uploaded != null && mapData.is_photo_uploaded) {
          this.url = mapData.profile_photo;
          this.uploadFilePhotoVideo = true;
        } else {
          this.uploadFilePhotoVideo = false;
        }
        if (mapData.is_photo_uploaded != null)
          this.reviewStepThreeForm.patchValue({
            stepDetailPhotoUpload:
              mapData.is_photo_uploaded == true ? 'Yes' : 'No',
          });
        if (mapData.is_intro_video_uploaded != null)
          this.reviewStepThreeForm.patchValue({
            stepDetailVideoUpload:
              mapData.is_intro_video_uploaded == true ? 'Yes' : 'No',
          });
      },
      error: (error: any) => {
      },
    });
  }

  photoUploadUrlUpdate(imageUrl: string) {
    let dataToSend = {
      profile_photo: imageUrl,
      is_photo_uploaded: this.url ? true : false,
    };
    return this.providerService.video(dataToSend).subscribe({
      next: (data: any) => {
        const resData: any = data;
      },
      error: (error: any) => {
      },
    });
  }
}
