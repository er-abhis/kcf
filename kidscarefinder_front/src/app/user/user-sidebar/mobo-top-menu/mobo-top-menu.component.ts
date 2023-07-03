import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobo-top-menu',
  templateUrl: './mobo-top-menu.component.html',
  styleUrls: ['./mobo-top-menu.component.scss']
})
export class MoboTopMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  menuOpen() {
    var menu = <any>document.querySelector('.sidebarleft');
    menu.classList.add("active_menu")
    // menu.classList.toggle('active_menu');
  }
}
