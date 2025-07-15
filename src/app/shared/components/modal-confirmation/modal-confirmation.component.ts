import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.css']
})
export class ModalConfirmationComponent {
  @Input() title = 'Confirmação';
  @Input() description = '';
  @Input() iconSrc?: string;                     // novo
  @Input() confirmButtonText = 'Confirmar';
  @Input() confirmButtonClass = 'btn-acao confirmar';      // PARA CASO QUEIRA TROCAR O ESTILO DO BOTÃO AO ESTANCIAR
  @Input() size: string = 'xl:max-w-7xl';

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onModalClose() { this.close.emit(); }
  onModalConfirm() { this.confirm.emit(); }

}
