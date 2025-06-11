import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from './components/spinner/spinner.component';
import { AlertComponent } from './components/alert/alert.component';

@NgModule({
  imports: [
    CommonModule,
    SpinnerComponent,   
    AlertComponent       
  ],
  exports: [

  ]
})
export class SharedModule { }
