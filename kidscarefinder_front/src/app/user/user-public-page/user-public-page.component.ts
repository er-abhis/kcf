import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/rest-services/user.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { MessengerService } from 'src/app/services/rest-services/messenger.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-public-page',
  templateUrl: './user-public-page.component.html',
  styleUrls: ['./user-public-page.component.scss']
})
export class UserPublicPageComponent implements OnInit {
  user: any;
  url: any;
  children: any = [];
  childCount: any;
  id: any;
  loginRole: any;
  constructor(private router: Router, private route: ActivatedRoute, private messengerService: MessengerService, private localServ: LocalstorageService, private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.loginRole = this.localServ.getUser()?.user_type;
    this.id = this.route.snapshot.paramMap.get("id");
    this.getUserDetails(this.id);
  }

  messageUser(user: any) {
    this.messengerService.user = user;
    if (user?.child?.id)
      this.messengerService.childArr = [user?.child?.id];
    this.router.navigate(['/user/message-center'])
  }

  getUserDetails(id: any) {
    if (id) {
      this.userService.getUserById(id).subscribe({
        next: (data: any) => {

          this.user = data.data[0];
          this.url = this.user.profile_photo;
          if (this.user.userDetails)
            this.getChildDetails(this.user.userDetails.id);
        },
        error: (error: any) => { },
      });
    }
  }
  getChildDetails(id: any) {
    //  let token = this.localServ.getToken();
    this.userService.getChildById(id).subscribe({
      next: (data: any) => {
        this.children = data.data;
        this.childCount = data.data.length;
      },
    });
  }

  subString(str:any,start:number,last:number){
   return str.substring(start,last)
  }
  usLast(str:any){
    return this.subString(str,0,1).toUpperCase();
  }
  ucFirst(str:any){
    return str.substring(0,1).toUpperCase()+ str.substring(1,str.length).toLowerCase()
  }
}
