import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent implements OnInit {  Infant: boolean = false;
  Toddler: boolean = false;
  Preschool: boolean = false;
  PreK: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.data.data?.agegroup.forEach((item: any)=>{
      if(item?.is_present){
        if(item?.agegroupcategory?.agegroupcategory == 'Preschool'){
          this.Preschool = true;
        }
        if(item?.agegroupcategory?.agegroupcategory == 'Pre-k'){
          this.PreK = true;
        }        
        if(item?.agegroupcategory?.agegroupcategory == 'Toddler'){
          this.Toddler = true;
        }        
        if(item?.agegroupcategory?.agegroupcategory == 'Infant'){
          this.Infant = true;
        }
      }
    })
  }

  closeModal() {
    this.dialog.closeAll();
  }

}
