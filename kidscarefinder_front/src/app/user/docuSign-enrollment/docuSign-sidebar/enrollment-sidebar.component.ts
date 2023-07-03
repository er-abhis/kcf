import { Component, OnInit, Input } from '@angular/core';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/utills/localstorage.service';

@Component({
  selector: 'app-enrollment-sidebar',
  templateUrl: './enrollment-sidebar.component.html',
  styleUrls: ['./enrollment-sidebar.component.scss']
})
export class EnrollmentSidebarComponent implements OnInit {

  @Input() SubStepsCount: any;
  @Input() providerData: any;
  basicInfoCount: any;
  showBackButton: boolean = false;
  showAllMenu: boolean = true;
  constructor(
    private providerService: ProviderService,
    private router: Router,
    private localStorage: LocalstorageService
  ) {}

  ngOnInit() {
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
    this.providerService.clickedFromSideBar.next({
      stepNumber: stepNumber,
      fromSideBar: true,
    });
    let url = '/provider/step/' + (stepNumber + 1);
    this.router.navigate([url]);
  }
  hideSidebar() {
    let leftPanel: any = document.getElementsByClassName('sidebarleft')[0];
    leftPanel.style.display = 'none';
  }
}

