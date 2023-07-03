import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-babysitter-signup-form',
  templateUrl: './babysitter-signup-form.component.html',
  styleUrls: ['./babysitter-signup-form.component.scss']
})
export class BabysitterSignupFormComponent implements OnInit {
  stepOne: FormGroup = new FormGroup([]);
  stepTwo: FormGroup = new FormGroup([]);
  stepThree: FormGroup = new FormGroup([]);

  constructor() { }

  ngOnInit(): void {
  }

}
