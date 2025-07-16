import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from './components/spinner/spinner.component';
import { AlertComponent } from './components/alert/alert.component';
import { ValidationErrorComponent } from './components/validation-error/validation-error.component';
import { InputArquivosComponent } from './components/input-arquivos/input-arquivos.component';
import { ModalDeleteComponent } from './components/modal-delete/modal-delete.component';
import { ModalConfirmationComponent } from './components/modal-confirmation/modal-confirmation.component';
import { SearchComponent } from './components/search/search.component';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  imports: [
    CommonModule,
    SpinnerComponent,   
    AlertComponent,
    ValidationErrorComponent, 
    FormsModule
  

  ],
  exports: [
    AlertComponent,
    SpinnerComponent, 
    ValidationErrorComponent,
    InputArquivosComponent,
    SearchComponent,
    PaginationComponent
  ],
  declarations: [
    InputArquivosComponent,
    ModalDeleteComponent,
    ModalConfirmationComponent,
    SearchComponent,
    PaginationComponent,
    
  ]
})
export class SharedModule { }
