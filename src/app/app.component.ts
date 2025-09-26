import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDeleteService } from './services/services/modal-delete.service';
import { ModalConfirmationService } from './services/services/modal-confirmation.service';
import { ModalCadastroService } from './services/services/modal-cadastro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-onebuild';

  @ViewChild('modalDeleteOutlet', { read: ViewContainerRef, static: true })
  modalDeleteOutlet!: ViewContainerRef;

  @ViewChild('modalConfirmationOutlet', { read: ViewContainerRef, static: true })
  modalConfirmationOutlet!: ViewContainerRef;

  @ViewChild('modalCadastroOutlet', { read: ViewContainerRef, static: true })
  modalOutlet!: ViewContainerRef;

  constructor(
    private modalDeleteService:ModalDeleteService,
    private modalConfirmationService: ModalConfirmationService,
    private modalCadastroService: ModalCadastroService
  ){}

  ngAfterViewInit(): void {
    this.modalDeleteService.registerOutlet(this.modalDeleteOutlet);
    this.modalConfirmationService.registerOutlet(this.modalConfirmationOutlet);
    this.modalCadastroService.registerOutlet(this.modalOutlet);
  }
}
