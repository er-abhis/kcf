import {Component, Input, OnInit} from '@angular/core';
import {monthNameArray, yearArray} from "../../../utills/constant/global.constants";
import {UserService} from "../../../services/rest-services/user.service";
import {FormArray, FormArrayName, FormBuilder, FormControl, FormGroup, ɵElement} from "@angular/forms";

@Component({
  selector: 'app-past-illness',
  templateUrl: './past-illness.component.html',
  styleUrls: ['./past-illness.component.scss']
})
export class PastIllnessComponent implements OnInit {
  monthNameArray: string[] = monthNameArray;
  yearArray: string[] = yearArray;
  illnessArray: { id: number, illness: string }[] = [];
  @Input() formGroup: any = this.formBuilder.group([]);

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.getIllnessData();
  }

  getIllnessData() {
    this.userService.getData().subscribe({
      next: (data: any) => {
        this.illnessArray = data.data;
        this.updateFormGroup();
        // this.illnessData = this.illness.data;
        // let newData = this.illnessData;
        // this.getValue = newData.map((obj: { id: any }) => obj.id);
      },
    });
  };

  updateFormGroup() {
    let temp = this.formBuilder.array([]);
    this.illnessArray.forEach(illness => {
      let a = this.formBuilder.group({
        illness: illness.id,
        month: '',
        year: '',
      });
      // @ts-ignore
      temp.push(a);
    });
    // this.formGroup.get('illness') = temp;
  }

  onSelected(item: any, $event: Event, id: string) {

  }
}
