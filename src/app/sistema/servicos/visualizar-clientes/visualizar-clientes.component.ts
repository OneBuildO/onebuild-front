import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { ClienteCadastroDTO } from '../cadastro-clientes/cliente-cadastro-dto';
import { ClienteService } from 'src/app/services/services/cliente.service';
import { ModalDeleteService } from 'src/app/services/services/modal-delete.service';

@Component({
  selector: 'app-visualizar-clientes',
  templateUrl: './visualizar-clientes.component.html',
  styleUrls: ['./visualizar-clientes.component.css']
})
export class VisualizarClientesComponent implements OnInit {

  termoBusca = '';
  mensagemBusca = '';
  isLoading = false;
  successMessage = '';
  messageTimeout: any;

  // para paginação
  clientes: ClienteCadastroDTO[] = [];
  clientesPaginados: ClienteCadastroDTO[] = [];
  itensPorPagina = 6;
  paginaAtual = 1;
  totalItens = 0;

  erro: string | null = null;

  constructor(
    private router: Router,
    private clienteService: ClienteService,
    private modalDeleteService: ModalDeleteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.exibirMensagemDeSucesso();
    this.fetchClientes();
  }

  cadastrarCliente(): void {
    this.router.navigate(['/usuario/cadastro-cliente']);
  }

  private fetchClientes(): void {
    this.clienteService.obterTodosClientes().subscribe({
      next: res => {
        if (res?.statusCode === 200) {
          this.clientes = res.response ?? [];
          this.erro = null;
        } else {
          this.erro = 'Erro ao buscar clientes.';
          this.clientes = [];
        }
        this.totalItens = this.clientes.length;
        this.atualizarPaginacao();
      },
      error: err => {
        console.error('Erro na API:', err);
        this.erro = 'Erro ao conectar com o servidor.';
        this.clientes = [];
        this.totalItens = 0;
        this.atualizarPaginacao();
      }
    });
  }

  visualizarCliente(id: string): void {
    this.router.navigate(['/usuario/detalhes-cliente', id]);
  }

  editarCliente(id: string): void {
    this.router.navigate(['/usuario/cadastro-cliente', id]);
  }

  openModalDeletar(cliente: ClienteCadastroDTO): void {
    this.modalDeleteService.openModal(
      {
        title: 'Remoção de Cliente',
        description: `Tem certeza que deseja excluir o cliente <strong>${cliente.nome}</strong>?`,
        item: cliente,
        deletarTextoBotao: 'Remover',
        size: 'md',
      },
      () => this.deleteCliente(cliente.id!)
    );
  }

  private deleteCliente(id: string): void {
    this.clienteService.deleteClientById(id).subscribe({
      next: () => {
        this.showMessage('success', 'Cliente apagado com sucesso.');
        this.fetchClientes();
      },
      error: err => {
        console.error('Erro ao deletar o cliente:', err);
      }
    });
  }

  /** Atualiza `clientesPaginados` com base em `paginaAtual` e `itensPorPagina` */
  private atualizarPaginacao(): void {
    const start = (this.paginaAtual - 1) * this.itensPorPagina;
    this.clientesPaginados = this.clientes.slice(start, start + this.itensPorPagina);
  }

  onPaginaMudou(novaPagina: number): void {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  /** Exibe mensagem passada via state (se houver) */
  private exibirMensagemDeSucesso(): void {
    const state = window.history.state as { successMessage?: string };
    if (state?.successMessage) {
      this.successMessage = state.successMessage;
      setTimeout(() => this.clearMessage(), 3000);
      window.history.replaceState({}, document.title);
    }
  }

  private showMessage(type: 'success' | 'error', msg: string): void {
  this.clearMessage();
  if (type === 'success') {
    this.successMessage = msg;
    this.messageTimeout = setTimeout(() => this.clearMessage(), 5000);
  }
}


  clearMessage(): void {
  this.successMessage = '';
  if (this.messageTimeout) {
    clearTimeout(this.messageTimeout);
    this.messageTimeout = null;
  }
}


  onVoltarClick(): void {
    const rota = this.authService.getHomeRouteForRole();
    this.router.navigate([rota]);
  }
}
