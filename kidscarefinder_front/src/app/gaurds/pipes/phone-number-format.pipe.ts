import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumberFormat'
})
export class PhoneNumberFormatPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    if (value) {
      const phoneNumber = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,4})(\d{0,5})/);
      if (phoneNumber) {
        return !phoneNumber[2]
          ? phoneNumber[1]
          : phoneNumber[1] +
          '-' +
          phoneNumber[2] +
          (phoneNumber[3] ? '-' + phoneNumber[3] : '');
      }
    }
    return ''
  }
}
