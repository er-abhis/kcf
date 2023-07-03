import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderUrlComponent } from 'src/app/component/static_pages/custom-modal/provider-url/provider-url.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/rest-services/user.service';
import { MessengerService } from 'src/app/services/rest-services/messenger.service';

@Component({
  selector: 'app-provider-setting-sidebar',
  templateUrl: './provider-setting-sidebar.component.html',
  styleUrls: ['./provider-setting-sidebar.component.scss'],
})
export class ProviderSettingSidebarComponent implements OnInit {
  organizationName: any;
  organizationType: any;
  addressDetails: any;
  welcome_icon_provider: any;
  providerId: any;
  public activeTab: any;
  @ViewChild('viewUrl', { static: false }) public viewUrlRef!: ElementRef
  @Output() orgName = new EventEmitter<boolean>();

  user_type: any;
  provider_id: any;
  userDetails_id: any;
  profilePicProvider: any;
  // Toggle button on off start
  optimization = 'off';
  providerUrlShow = false;
  enrollments = 'off';
  applications = 'off';
  Waitlist = 'off';
  uniqueId: any;

  toggle(type: any) {
    if (type == 'optimization' && this.optimization == 'on') {
      this.optimization = 'off';
      let data: any = {};
      data.search_result_optimization =  false;
      this.updateProviderFilters(data);
    } else if (type == 'optimization' && this.optimization == 'off') {
      this.optimization = 'on';
      let data: any = {};
      data.search_result_optimization = true;
      this.updateProviderFilters(data);
    }

    if (type == 'enrollments' && this.enrollments == 'on') {
      this.enrollments = 'off';
      let data: any = {};
      data.enrollment_documentation =  false;
      this.updateProviderFilters(data);
    } else if (type == 'enrollments' && this.enrollments == 'off') {
      this.enrollments = 'on';
      let data: any = {};
      data.enrollment_documentation =  true;
      this.updateProviderFilters(data);
    }

    if (type == 'applications' && this.applications == 'on') {
      this.applications = 'off';
      let data: any = {};
      data.apply_online =  false;
      this.updateProviderFilters(data);
    } else if (type == 'applications' && this.applications == 'off') {
      this.applications = 'on';
      let data: any = {};
      data.apply_online = true;
      this.updateProviderFilters(data);
    }

    if (type == 'Waitlist' && this.Waitlist == 'on') {
      this.Waitlist = 'off';
      let data: any = {};
      data.waitlist_functionality =  false;
      this.updateProviderFilters(data);
    } else if (type == 'Waitlist' && this.Waitlist == 'off') {
      this.Waitlist = 'on';
      let data: any = {};
      data.waitlist_functionality =  true;
      this.updateProviderFilters(data);
    }
  }

  // Toggle button on off end
  onSelectTab(newTab: string): void {
    this.activeTab = newTab;
    this.router.navigate([newTab]);
  }
  constructor(
    public providerService: ProviderService,
    private localStorage: LocalstorageService,
    private messengerService: MessengerService,
    private router: Router,
    public dialog: MatDialog,
    public userService: UserService,
    private changeDetector : ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.providerService.sideBarChange.subscribe((change:any)=>{
      if(change){
        this.providerDetails();
        this.getProviderAddressDetails();
      }
    })
    this.providerDetails();
    this.getProviderAddressDetails();
    this.getProviderFilters();
    this.localStorage.saveKey('backButton', false);
    this.providerId = this.localStorage.getUser()?.provider_id;
    this.msgNotify();
  }
  editProviderDetails() {
    this.localStorage.saveKey('backButton', true);
    this.router.navigateByUrl('/provider/step/1').then(() => {
      window.location.reload();
    });
  }
  msgNotify() {
    let data: any = {}
    this.user_type = this.localStorage.getUser().user_type;
    this.provider_id = this.localStorage.getUser().provider_id;
    this.userDetails_id = this.localStorage.getUser().userDetails_id;

    if (this.user_type == 'USER') {
      data.user_id = this.userDetails_id;
    }
    if (this.user_type == 'PROVIDER') {
      data.provider_id = this.provider_id;
    }
    this.messengerService.allrooms(data).subscribe({
      next: (res: any) => {
        this.userService.newMsgCount = res.data?.new_messages;
      },
    });
  }

  getProviderFilters() {
    this.providerService.getProviderFilters().subscribe({
      next: (data: any) => {
        this.optimization =
          data.data?.search_result_optimization == true ? 'on' : 'off';
        this.Waitlist = data.data?.waitlist == true ? 'on' : 'off';
        this.applications =
          data.data?.online_application == true ? 'on' : 'off';
        this.enrollments = data.data?.online_enrollment == true ? 'on' : 'off';
      },
    });
  }
  getProviderAddressDetails() {
    this.providerService.getProviderAddressDetails().subscribe({
      next: (data: any) => { 
        if (data && data?.data && data?.code == 200) {
          this.addressDetails = data.data[0];
        }
      },
    });
  }  
  updateProviderFilters(data: any) {
    this.providerService.updateProviderFilters(data).subscribe({
      next: (data: any) => { },
    });
  }

  providerUrl() {
    const dialogRef = this.dialog.open(ProviderUrlComponent, {
      // width: '80vw',
      // maxWidth: '700px',
      panelClass: 'CustomModal',
      backdropClass: 'cdk-overlay-transparent-backdrop',
      // hasBackdrop: false,
      data: {
        positionRelativeToElement: this.viewUrlRef,
        addressDetails: this.addressDetails,
        organizationName: this.organizationName
      },
    });
  }

  providerDetails() {
    let id = this.localStorage.getUser().id;

    this.providerService.getProviderBasicInfo().subscribe({
      next: (data: any) => {
        this.welcome_icon_provider = data.data?.first_name[0].toUpperCase();
        this.profilePicProvider = data.data?.profile_photo;
        this.organizationName = data.data?.organization_name;
        this.orgName.emit(this.organizationName);
        this.organizationType = data.data?.providercategory.providercategory;
        this.uniqueId = data.data?.unique_provider_id;
        this.providerService.uniqueProviderId = this.uniqueId;
        if (this.organizationType == 'Pre-school') {
          this.organizationType == 'Preschool';
        }
      },
    });
  }
  showSideBar() {
    let lefPanel: any = document.getElementsByClassName('sidebarleft')[0];
    lefPanel.style.display = 'block';
  }
  hideSidebar() {
    let leftPanel: any = document.getElementsByClassName('sidebarleft')[0];
    leftPanel.style.display = 'none';
  }
}
