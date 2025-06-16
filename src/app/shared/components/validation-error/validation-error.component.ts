import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import { ERROR_MESSAGES } from './error-messages';

@Component({
  selector: 'validation-error',
  templateUrl: './validation-error.component.html',
  styleUrls: ['./validation-error.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ValidationErrorComponent implements OnInit {

  @Input() submited?: boolean;
  @Input() valueValidation?: string;
  @Input() errorMessage?: string = ERROR_MESSAGES.required();

  constructor() {}
  ngOnInit(): void {}

  hasError(): boolean {
    return !!(this.submited && !this.valueValidation);
  }
}