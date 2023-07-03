import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'app-usual-picker',
  templateUrl: './usual-picker.component.html',
  styleUrls: ['./usual-picker.component.scss']
})
export class UsualPickerComponent implements OnInit {
  @Input() label: string = 'What is usual time?';
  @Input() isFormSubmitted: boolean = false;
  @Input() control: FormControl = new FormControl<any>('');

  constructor() { }
  uniqueId = '';

  ngOnInit(): void {
    this.genUniqueId();

  }
  genUniqueId() {
    const dateStr = Date
      .now()
      .toString(36); // convert num to base 36 and stringify

    const randomStr = Math
      .random()
      .toString(36)
      .substring(2, 8); // start at index 2 to skip decimal point

    this.uniqueId = `${dateStr}-${randomStr}`;
  }


}
