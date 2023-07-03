import {Component, OnInit, Input} from '@angular/core';
import {ProviderService} from 'src/app/services/rest-services/provider.service';
import {NotificationService} from 'src/app/utills/notification.service';
import * as moment from "moment";
import {Moment} from "moment";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent implements OnInit {
  statics: any;
  organizationName: string = '';
  selectInterval = new FormControl('Current month-to-date');
  intervals: Moment[] = this.generateIntervals();
  selectedInterval: string = '';
  protected readonly moment = moment;

  constructor(private providerService: ProviderService,
              private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.providerService.getProviderBasicInfo().subscribe(data => {
      this.organizationName = data.data?.organization_name;
    })
    this.selectedInterval = moment().startOf("month").format('MM/DD/YY') + ' - ' + moment().format('MM/DD/YY');
    this.getUserActivity(moment());
    this.selectInterval.valueChanges.subscribe(e => {
      this.selectedInterval = moment(e).startOf('month').format('MM/DD/YY') + ' - ' + moment(e).format('MM/DD/YY')
      this.getUserActivity(moment(e));
    })

  }

  generateIntervals(): Moment[] {
    let intervals: Moment[] = [];
    intervals[0] = moment();
    for (let i = 1; i <= 5; i++) {
      intervals.push(moment().subtract(i, 'month'));
    }
    return intervals
  }

  getUserActivity(e: Moment) {
    let params: { start_date: string, end_date: string } = {
      start_date: '',
      end_date: ''
    }
    if (moment(e).format('MM/DD/YY') === moment().format('MM/DD/YY')) {
      params.end_date = moment(e).format();
    } else {
      params.end_date = moment(e).endOf('month').format()
    }
    params.start_date = moment(e).startOf('month').format();
    this.providerService.getUserActivityStatics(params).subscribe({
      next: (res: any) => {
        this.statics = res.data;
      },
        error: (error: any) => {
        this.notificationService.showError('Error in fetching data');
      },
    });
  }
}
