import { Injectable } from '@angular/core';
import * as moment from "moment/moment";

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  getFormattedDate(date: Date, format: string) {
    return moment(date).format(format)
  }
}
