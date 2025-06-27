import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDeleteService } from './services/services/modal-delete.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-onebuild';

  @ViewChild('modalDeleteOutlet', { read: ViewContainerRef, static: true })
  modalOutlet!: ViewContainerRef;

  constructor(
    private modalService:ModalDeleteService
  ){}

  ngAfterViewInit(): void {
    this.modalService.registerOutlet(this.modalOutlet);
  }
}
