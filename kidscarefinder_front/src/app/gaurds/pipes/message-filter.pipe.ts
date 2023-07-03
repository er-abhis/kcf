import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'messageFilter'
})
export class MessageFilterPipe implements PipeTransform {

  transform(value: any, input: any, type: any): any {
    if (input) {
      input = input?.trim();
      input = input?.toLowerCase();
       return value.filter((val: any) => {
        if(type=='USER'){
          if((val.provider?.prov_organization_name?.toLowerCase().indexOf(input)>-1)){
            return true;
          }
          else{
            return false;
          }
        }
        if(type === 'PROVIDER'){
          if((val.user?.first_name.toLowerCase().indexOf(input)>-1) || (val.user?.last_name.toLowerCase().indexOf(input)>-1)){
            return true;
          }
          else{
            return false;
          }
        }
        else{
          return false;
        }
      })
     } 
     else {
      return value;
    }
    }

}
