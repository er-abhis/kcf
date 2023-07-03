import {
  Component,
  OnInit,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { SlidesOutputData, OwlOptions } from 'ngx-owl-carousel-o';
import { DOCUMENT } from '@angular/common';
import { AuthService } from 'src/app/services/rest-services/auth.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import ShortUniqueId from 'short-unique-id';

interface Slide {
  id: number;
  img: string;
  alt: string;
  title: string;
  route: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isLoginFailed = false;
  isLoggedIn = false;
  email: any = null;
  token: any = null;

  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private doc: any,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private notification: NotificationService,
    private localStorage: LocalstorageService,
    private router: Router,
    private providerService: ProviderService
  ) { }

  public slides: Slide[] = [
    {
      id: 1,
      img: '../../../assets/images/slider/1.jpg',
      alt: 'Babysitter',
      title: 'Babysitter',
      route: '/',
    },
    {
      id: 2,
      img: '../../../assets/images/slider/2.jpg',
      alt: 'Private nanny',
      title: 'Private nanny',
      route: '/',
    },
    {
      id: 3,
      img: '../../../assets/images/slider/3.jpg',
      alt: 'Nanny share',
      title: 'Nanny share',
      route: '/',
    },
    {
      id: 4,
      img: '../../../assets/images/slider/4.jpg',
      alt: 'In-home daycare',
      title: 'In-home daycare',
      route: '/',
    },
    {
      id: 5,
      img: '../../../assets/images/slider/5.jpg',
      alt: 'Daycare center',
      title: 'Daycare center',
      route: '/',
    },
    {
      id: 6,
      img: '../../../assets/images/slider/6.jpg',
      alt: 'Preschool',
      title: 'Preschool',
      route: '/preschool',
    },
    {
      id: 7,
      img: '../../../assets/images/slider/7.jpg',
      alt: 'Private school (TK-12)',
      title: 'Private school (TK-12)',
      route: '/',
    },
    {
      id: 8,
      img: '../../../assets/images/slider/8.jpg',
      alt: 'Before/after care',
      title: 'Before/after care',
      route: '/',
    },
    {
      id: 9,
      img: '../../../assets/images/slider/9.jpg',
      alt: 'Sports & recreation',
      title: 'Sports & recreation',
      route: '/',
    },
    {
      id: 10,
      img: '../../../assets/images/slider/10.jpg',
      alt: 'Summer camps',
      title: 'Summer camps',
      route: '/',
    },
    {
      id: 11,
      img: '../../../assets/images/slider/11.jpg',
      alt: 'Music teachers',
      title: 'Music teachers',
      route: '/',
    },
    {
      id: 12,
      img: '../../../assets/images/slider/12.jpg',
      alt: 'Tutors',
      title: 'Tutors',
      route: '/',
    },
    {
      id: 13,
      img: '../../../assets/images/slider/Parent and me V2.jpg',
      alt: 'Parent & me classes',
      title: 'Parent & me classes',
      route: '/',
    },
    {
      id: 14,
      img: '../../../assets/images/slider/14.jpg',
      alt: 'Special needs programs',
      title: 'Special needs programs',
      route: '/',
    },
  ];

  //  impersonation user  token base login section start
  ImpersonationLogin() {
    let dataToSend = {
      email: this.email,
      password: '',
      ImpersonationToken: this.token,
    };
    this.authService.login(dataToSend).subscribe({
      next: (data) => {
        const resData: any = data;
        if (resData.success != undefined) {
          if (resData.success == false) {
            this.notification.showError(resData.message);
            return;
          }
        }
        this.notification.showSuccess(CustomAlertMessage.Login[0].message);
        this.localStorage.saveToken(resData.tokens.access);
        this.localStorage.saveUser(resData);
        this.isLoginFailed = false;
        localStorage.setItem('userid', data.id);
        this.isLoggedIn = true;
        if (data?.user_type == 'USER') {
          localStorage.setItem('user_id', data?.userDetails_id);
          this.router.navigateByUrl('/');
        }
        if (data?.user_type == 'PROVIDER') {
          localStorage.setItem('provider_id', data?.provider_id);
          this.getProviderStepsStatus(data?.provider_id);
        }
      },
      error: (error: any) => {
        this.isLoginFailed = true;
        if (error.status == 401) {
          this.notification.showWarning(CustomAlertMessage.Login[2].message);
        }

        if (error.status == 500) {
          this.notification.showError(error.statusText);
        }
      },
    });
  }

  getProviderStepsStatus(id: any) {
    this.providerService.getProviderSignupStepsStatus(id).subscribe({
      next: (res) => {
        let data = res.data;
        let steps_completed: any = null;
        for (let i = 1; i <= 10; i++) {
          let property = `step${i}_completed`;
          if (!data[property]) {
            steps_completed = i;
            break;
          }
        }
        if (!data?.unique_provider_id) {
          const uid = new ShortUniqueId({ length: 8 });
          this.providerService
            .updateProviderSignupSteps({ unique_provider_id: uid() }, id)
            .subscribe((res) => {
              if (steps_completed != null)
                this.router
                  .navigateByUrl(`/provider/step/${steps_completed}`)
                  .then(() => {
                    window.location.reload();
                  });
              else if (steps_completed == null) {
                this.router.navigateByUrl(`/`).then(() => {
                  window.location.reload();
                });
              } else
                this.router.navigateByUrl('/').then(() => {
                  window.location.reload();
                });
            });
        } else {
          if (steps_completed != null)
            this.router
              .navigateByUrl(`/provider/step/${steps_completed}`)
              .then(() => {
                window.location.reload();
              });
          else if (steps_completed == null) {
            this.router.navigateByUrl(`/`).then(() => {
              window.location.reload();
            });
          } else
            this.router.navigateByUrl('/').then(() => {
              window.location.reload();
            });
        }
      },
      error: (error) => { },
    });
  }

  ngOnInit(): void {
    // setTimeout(() => {}, 200);
    this.activatedRoute.paramMap.subscribe((a: any) => {
      this.token = a.params.data;
      if (this.token != undefined) {
        let removeLast = this.token?.substring(0, this.token?.length - 6);
        this.email = atob(
          this.hex_to_ascii(removeLast?.substring(6, this.token?.length))
        );
        this.ImpersonationLogin();
      }

    });
  }

  hex_to_ascii(str1: string) {
    var hex = str1?.toString();
    var str = '';
    for (var n = 0; n < hex?.length; n += 2) {
      str += String.fromCharCode(parseInt(hex?.substr(n, 2), 16));
    }
    return str;
  }
}
//  impersonation user  token base login section end
