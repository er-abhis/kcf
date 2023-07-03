import { Component, OnInit, Input } from '@angular/core';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { subscriptionPlans } from 'src/app/utills/constant/global.constants';
@Component({
  selector: 'app-in-home-daycare-sidebar',
  templateUrl: './in-home-daycare-sidebar.component.html',
  styleUrls: ['./in-home-daycare-sidebar.component.scss']
})
export class InHomeDaycareSidebarComponent implements OnInit {
  @Input() SubStepsCount: any;
  @Input() providerData: any;
  basicInfoCount: any;
  showBackButton: boolean = false;
  showAllMenu: boolean = true;
  constructor(private providerService: ProviderService,
    private router: Router,
    private localStorage: LocalstorageService) { }

  ngOnInit(): void {
    this.providerService.enableSideBar.subscribe((enable: boolean) => {
      this.showAllMenu = enable ? true : false;
    });
    this.showBackButton = this.localStorage.getKey('backButton');
  }
  providerPortal() {
    this.showBackButton = false;
    this.localStorage.saveKey('backButton', false);
    this.router.navigate(['/providerSettings/my-information']);
  }

  sideBarNav(stepNumber: number) {
    if (!this.showAllMenu) {
      return;
    }
    if (window.innerWidth < 768) {
      this.hideSidebar();
    }
    if (stepNumber == 9 && this.providerData?.provider_subscription?.id == subscriptionPlans[3].id) {
      this.providerService.clickedFromSideBar.next({
        stepNumber: stepNumber,
        fromSideBar: false,
      });
    }
    else {
      this.providerService.clickedFromSideBar.next({
        stepNumber: stepNumber,
        fromSideBar: true,
      });
    }

    let url = '/daycare/step/' + (stepNumber + 1);
    this.router.navigate([url]);
  }
  hideSidebar() {
    let leftPanel: any = document.getElementsByClassName('sidebarleft')[0];
    leftPanel.style.display = 'none';
  }

}
