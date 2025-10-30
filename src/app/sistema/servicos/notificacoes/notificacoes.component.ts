import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { ClienteService } from 'src/app/services/services/cliente.service';
import { Notificacao } from './Notificacao';
import { ModalConfirmationService } from 'src/app/services/services/modal-confirmation.service';
import { NotificacaoService } from 'src/app/services/services/notificacao.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.css']
})
export class NotificacoesComponent implements OnInit {
  isLoading:boolean = false;
  notificacoes: Notificacao[] = [];
  notificacoesPaginadas: Notificacao[] = [];
  notificacoesFiltradas: Notificacao[] = [];

  filtroSelecionado: string = 'todos'; 

  paginaAtual: number = 1;
  itensPorPagina: number = 5;
  totalItens: number = 0;
  totalPaginas: number = 0;

  private subscriptions = new Subscription();
  
  constructor(
      private router: Router,
      private clienteService: ClienteService,
      private authService: AuthService,
      private modalConfirmationService: ModalConfirmationService,
      private notificacaoService : NotificacaoService
    ) {}
          
        
  ngOnInit(): void {
    this.obterNotificacoes();
  }
      
  onVoltarClick() {
    const rota = this.authService.getHomeRouteForRole();
    this.router.navigate([rota]);
  }

  onFiltroChange(event: any): void {
    this.filtroSelecionado = event.target.value;
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    // Aplica o filtro e armazena em notificacoesFiltradas
    switch (this.filtroSelecionado) {
      case 'lidas':
        this.notificacoesFiltradas = this.notificacoes.filter(n => n.lida);
        break;
      case 'nao-lidas':
        this.notificacoesFiltradas = this.notificacoes.filter(n => !n.lida);
        break;
      case 'todos':
      default:
        this.notificacoesFiltradas = [...this.notificacoes]; // Cria uma cópia
        break;
    }

    this.paginaAtual = 1; // Resetar para primeira página
    this.atualizarPaginacao();
  }

  openModalConfirmacao(){
    this.modalConfirmationService.open({
        title: 'Marca as notificações',
        description: `Tem certeza que deseja marcar todas as notificações como lidas?`,
        confirmButtonText: 'Confirmar',
        size: 'md',
      },
      () => {
        this.markAllAsRead();
      }
    );
  }


  // Método para marcar notificações como lidas
  markNotificationAsRead(notificacao: Notificacao): void {
    notificacao.lida = true;
    this.notificacaoService.marcarComoLida(notificacao.id).subscribe({
      next: () => {
        console.log('Notificação marcada como lida');
        this.aplicarFiltro(); // Reaplicar filtro após marcar como lida
      },
      error: (error) => {
        console.error('Erro ao marcar notificação como lida', error);
      }
    });
  }

  markAllAsRead(): void {
    // Marca todas as notificações como lidas
    this.notificacoes.forEach(notification => {
      notification.lida = true;
    });
    
    this.aplicarFiltro(); // Reaplicar filtro após marcar todas
    
    // Aqui você também pode adicionar uma chamada API se necessário
    this.notificacaoService.marcarTodasComoLidas().subscribe(
      response => {
        console.log('Notificações marcadas como lidas:', response);
      },
      error => {
        console.error('Erro ao marcar notificações como lidas:', error);
      }
    );
  }

  obterNotificacoes(){
    this.notificacaoService.obterNotificacoes().subscribe(
      (notificacao) => {
        console.log(notificacao);
        this.notificacoes = notificacao;
        this.notificacoesFiltradas = [...notificacao]; // Inicializa com todas as notificações
        this.atualizarPaginacao();
      },
      (err) => {
        console.error('Erro ao buscar notificações', err);
      }
    );
  }

  atualizarPaginacao(): void {
    this.totalItens = this.notificacoesFiltradas.length;
    this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina);
    
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.notificacoesPaginadas = this.notificacoesFiltradas.slice(inicio, fim);
  }

  onPaginaMudou(novaPagina: number): void {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }
}
