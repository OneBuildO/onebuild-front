import { Injectable, ComponentRef, ViewContainerRef } from '@angular/core';
import { ModalConfirmationComponent } from 'src/app/shared/components/modal-confirmation/modal-confirmation.component';

@Injectable({ providedIn: 'root' })
export class ModalConfirmationService {
  private outlet!: ViewContainerRef;
  private modalRef!: ComponentRef<ModalConfirmationComponent>;

  registerOutlet(outlet: ViewContainerRef) {
    this.outlet = outlet;
  }

  open(
    config: Partial<ModalConfirmationComponent>,
    onConfirm?: () => void
  ) {
    if (!this.outlet) throw new Error('Outlet não registrado!');
    this.outlet.clear();
    this.modalRef = this.outlet.createComponent(ModalConfirmationComponent);
    Object.assign(this.modalRef.instance, config);

    this.modalRef.instance.close.subscribe(() => this.close());
    this.modalRef.instance.confirm.subscribe(() => {
      if (onConfirm) onConfirm();
      this.close();
    });
  }

  close() {
    if (this.modalRef) {
      this.modalRef.destroy();
    }
  }
}
