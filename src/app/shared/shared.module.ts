import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from './components/spinner/spinner.component';
import { AlertComponent } from './components/alert/alert.component';
import { ValidationErrorComponent } from './components/validation-error/validation-error.component';
import { InputArquivosComponent } from './components/input-arquivos/input-arquivos.component';
import { ModalDeleteComponent } from './components/modal-delete/modal-delete.component';

@NgModule({
  imports: [
    CommonModule,
    SpinnerComponent,   
    AlertComponent,
    ValidationErrorComponent,   
  ],
  exports: [
    AlertComponent,
    SpinnerComponent, 
    ValidationErrorComponent,
    InputArquivosComponent
  ],
  declarations: [
    InputArquivosComponent,
    ModalDeleteComponent
  ]
})
export class SharedModule { }
