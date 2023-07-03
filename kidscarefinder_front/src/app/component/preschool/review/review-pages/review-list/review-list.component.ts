import { Component, OnInit, ElementRef, Inject, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/rest-services/user.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';

@Component({
  selector: 'kcf-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {
  @Input() reviewList: any;
  Promsg:boolean = false
  Array = Array;
  Math = Math;
  firstName: any;
  lastName: any;
  welcome_name: any;
  isImage: boolean = false;
  selected_provider : any;
  url : any;
  user : any;

  constructor( private userService: UserService, private localstorage: LocalstorageService) { }

  ngOnInit(): void {
    this.userDetails();
    this.getUserDetails();
  }

  onImgError(event:any) {
    event.target.src = '../../../../assets/images/placeholder.jpg';
  }

  RespProvider (event:any){
    this.Promsg ? this.Promsg = false : this.Promsg = true
  }
  RespProviderClosee(event:any){

    this.Promsg = false
  }

  userDetails() {
    let id = this.localstorage.getUser().id;
    this.userService.getUserById(id).subscribe({
      next: (data: any) => {
        this.firstName = data.data[0].userDetails.first_name;
        this.lastName = data.data[0].userDetails.last_name[0];
        this.welcome_name =  data.data?.[0].userDetails.first_name[0];
      },
    });
  }

  getUserDetails() {
    let id = this.localstorage.getUser().id;
    this.userService.getUserById(id).subscribe({
      next: (data: any) => {
        this.user = data.data[0];
        // if(this.user.profile_photo===""){
        //   this.isImage = false;
        // }else{
        //   this.url = this.user.profile_photo;
        // }


        // let newData = this.user.userDetails.interested_provider_type;
        // this.selected_provider = newData.map((obj: { id: any }) => obj.id);
      },
      error: (error: any) => {},
    });
  }
}
