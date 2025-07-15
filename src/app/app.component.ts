import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDeleteService } from './services/services/modal-delete.service';
import { ModalConfirmationService } from './services/services/modal-confirmation.service';

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

  constructor(
    private modalDeleteService:ModalDeleteService,
    private modalConfirmationService: ModalConfirmationService
  ){}

  ngAfterViewInit(): void {
    this.modalDeleteService.registerOutlet(this.modalDeleteOutlet);
    this.modalConfirmationService.registerOutlet(this.modalConfirmationOutlet);
  }
}
