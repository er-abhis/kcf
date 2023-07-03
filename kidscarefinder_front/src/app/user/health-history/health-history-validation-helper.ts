import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";

export function updateSlaveControlValidation(slaveControlName: string, condition: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup: FormGroup = (control as FormControl).parent as FormGroup;
    if (formGroup) {
      const slaveControl = formGroup.controls[slaveControlName];
      if (control.value === condition) {
        slaveControl.setValidators([Validators.required]);
      } else {
        slaveControl.clearValidators();
      }
      slaveControl.updateValueAndValidity();
    }
    return null
  };
}
