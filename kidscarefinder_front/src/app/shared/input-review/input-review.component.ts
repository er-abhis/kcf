import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-input-review',
  templateUrl: './input-review.component.html',
  styleUrls: ['./input-review.component.scss']
})
export class InputReviewComponent implements OnInit {

  @Input() data: { key: string, value: string } = {
    key: '',
    value: ''
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
