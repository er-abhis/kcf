import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-bs-signup-step-one',
  templateUrl: './bs-signup-step-one.component.html',
  styleUrls: ['./bs-signup-step-one.component.scss']
})
export class BsSignupStepOneComponent implements OnInit {

  subSteps: { screen: string, isActive: boolean }[] = [
    {screen: 'welcome', isActive: true},
    {screen: 'register-form', isActive: false},
    {screen: 'description', isActive: false},
    {screen: 'review-step-one', isActive: false}
  ];
  basicInfoRegisterForm = {};
  basicInfoDescriptionForm = {};

  constructor() {
  }

  ngOnInit(): void {
  }

  continueToSubStep(subStep: string) {
    this.makeScreenAsActive(subStep);
  }

  makeScreenAsActive(screen: string) {
    this.hideAllScreens();
    const item = this.subSteps.filter(subStep => subStep.screen === screen)[0]
    const index = this.subSteps.indexOf(item);
    this.subSteps[index].isActive = true;
  }

  hideAllScreens() {
    this.subSteps.forEach((subStep) => {
      subStep.isActive = false;
    })
  }

  isScreenActive(screen: string) {
    return this.subSteps.filter(subSteps => subSteps.screen === screen)[0].isActive
  }

  stepCompleted(form: string, event: any) {
    if (form === 'register-form') {
      this.basicInfoRegisterForm = event;
      this.makeScreenAsActive('description');
    }
    if (form === 'description') {
      this.basicInfoDescriptionForm = event;
      this.makeScreenAsActive('review-step-one');
    }
  }

  navigateTo(screen: string) {
    this.makeScreenAsActive(screen);
  }
}
