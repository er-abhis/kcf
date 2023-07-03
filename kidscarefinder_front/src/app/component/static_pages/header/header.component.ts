import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
 path : any = ''
  constructor(private route: ActivatedRoute) {
    this.path = this.route?.snapshot?.component?.name
  }

  ngOnInit(): void {
  }
}
