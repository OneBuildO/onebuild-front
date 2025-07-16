import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { ClienteCadastroDTO } from '../cadastro-clientes/cliente-cadastro-dto';
import { ClienteService } from 'src/app/services/services/cliente.service';
import { ModalDeleteService } from 'src/app/services/services/modal-delete.service';
import { ApiResponse } from 'src/app/services/services/api-response-dto';

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

  clientes: ClienteCadastroDTO[] = [];
  clientesPaginados: ClienteCadastroDTO[] = [];
  itensPorPagina = 6;
  paginaAtual = 1;
  totalPaginas = 0; 
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

  fetchClientes(): void {
    this.isLoading = true;

    this.clienteService.obterTodosClientes().subscribe(
      (cliente: ApiResponse<ClienteCadastroDTO[]>) => {
        this.clientes = cliente.response;
        this.totalItens = this.clientes.length; 
        this.totalPaginas = Math.ceil(
          this.clientes.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar colaboradores:', error);
        this.isLoading = false;
      }
    );
  }


  onSearch(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.mensagemBusca = '';
      this.fetchClientes();
      return;
    }
    this.isLoading = true;
    this.clienteService.buscarUsuariosPorNome(searchTerm).subscribe(
      (cliente: ApiResponse<ClienteCadastroDTO[]>) => {
        this.clientes = cliente.response;
        this.paginaAtual = 1;
        this.totalItens = this.clientes.length;
        this.totalPaginas = Math.ceil(
          this.clientes.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
        if (!cliente || cliente.response.length === 0) {
          this.mensagemBusca = 'Busca não encontrada';
        }
      },
      (error) => {
        console.error('Erro ao buscar colaboradores:', error);
        this.isLoading = false;
        if (error.message && error.message.includes('404')) {
          this.clientes = [];
          this.totalItens = 0; 
          this.atualizarPaginacao();
          this.mensagemBusca = 'Busca não encontrada';
        }
      }
    );
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
    this.isLoading = true;
    this.clienteService.deleteClientById(id).subscribe({
      next: () => {
        this.showMessage('success', 'Cliente apagado com sucesso.');
        this.fetchClientes();
        this.isLoading = false;
      },
      error: err => {
        console.error('Erro ao deletar o cliente:', err);
      }
    });
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.clientesPaginados = this.clientes.slice(inicio, fim);
  }

  onPaginaMudou(novaPagina: number): void {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  private exibirMensagemDeSucesso(): void {
    const state = window.history.state as { successMessage?: string };
    if (state?.successMessage) {
      this.successMessage = state.successMessage;
      setTimeout(() => this.clearMessage(), 6000);
      window.history.replaceState({}, document.title);
    }
  }

  private showMessage(type: 'success' | 'error', msg: string): void {
    this.clearMessage();
    if (type === 'success') {
      this.successMessage = msg;
      this.messageTimeout = setTimeout(() => this.clearMessage(), 6000);
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