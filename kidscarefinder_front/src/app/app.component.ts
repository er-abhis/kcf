import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from './utills/localstorage.service';
import { UserService } from './services/rest-services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'KidsCareFinder';
  constructor(private localstorage: LocalstorageService, private router : Router, private userService : UserService) { }

  isLoggedIn = false;
  ngOnInit(): void {

    var user = this.localstorage.getUser();
    if(user.length > 0){
      this.isLoggedIn = true;
    }
  }
}
