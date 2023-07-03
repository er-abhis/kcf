import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/rest-services/user.service';

@Component({
  selector: 'app-enrollment-validation',
  templateUrl: './enrollment-validation.component.html',
  styleUrls: ['./enrollment-validation.component.scss']
})
export class EnrollmentValidationComponent implements OnInit {
  public selectedVal = 6;
  stepCount: number = 0;
  showLoader: boolean = false;

  @Input()
  set selectedCurrentIndex(value: number) {
    this.selectedVal = value;
    if (this.selectedVal == 6) {
      this.callDocuSign();

      // this.getUserPreference();
    }
  }
  get selectedcurrentIndex(): number {
    return this.selectedVal;
  }
  @Input()
  set stepCountNumber(value: any) {
    if (this.selectedVal == 6) {
      // this.getUserPreference();
      this.stepCount = + value;
    }
  }
  get stepCountNumber(): number {
    return this.stepCount;
  }
  constructor(
    private UserService: UserService,

  ) { }

  async ngOnInit() {
    this.showLoader = true;

  }
  callDocuSign() {
    let ItemData = this.UserService.getEnrolledItem();
    let dataToSend = {
      child: ItemData?.child?.id,
      provider: ItemData?.provider?.id,
      parent_1: ItemData?.parent_1?.id,
      parent_2: ItemData?.parent_2?.id ? ItemData?.parent_2?.id : "",
    }
    this.UserService.fillPdfData(dataToSend).subscribe({
      next: (data) => {
        const resData: any = data;
        this.showLoader = false;

      }
    });

  }
}
