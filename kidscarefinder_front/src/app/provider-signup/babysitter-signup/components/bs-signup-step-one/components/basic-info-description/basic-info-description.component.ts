import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-basic-info-description',
  templateUrl: './basic-info-description.component.html',
  styleUrls: ['./basic-info-description.component.scss']
})
export class BasicInfoDescriptionComponent implements OnInit {
  description: string = '';
  @Output() stepCompleted = new EventEmitter<{}>();
  @Output() navigateTo = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  navigate(to: string) {
    switch (to) {
      case 'next':  {
        this.stepCompleted.emit({description: this.description});
        this.navigateTo.emit('review-step-one');
        break;
      }
      case 'back': {
        this.navigateTo.emit('register-form');
        break
      }
    }
  }
}
