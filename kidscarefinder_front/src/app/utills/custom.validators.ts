import {FormGroup} from "@angular/forms";

export function confirmPasswordValidator(password: string, confirmPassword: string) {
  return (formGroup: FormGroup) => {
    const passwordControl = formGroup.controls[password];
    const confirmPasswordControl = formGroup.controls[confirmPassword];
    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({passwordNotMatch: true});
    } else {
      confirmPasswordControl.setErrors(null);
    }
  };
}
