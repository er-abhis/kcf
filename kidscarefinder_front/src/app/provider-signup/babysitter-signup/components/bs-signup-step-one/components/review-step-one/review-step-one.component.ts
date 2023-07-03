import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-review-step-one',
  templateUrl: './review-step-one.component.html',
  styleUrls: ['./review-step-one.component.scss']
})
export class ReviewStepOneComponent implements OnInit {

  @Input() basicInfoRegisterFormData: any = {};
  @Input() basicInfoDescriptionFormData: any = {};

  constructor() { }

  ngOnInit(): void {
  }

  changePassword() {

  }
}
