import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { ClienteCadastroDTO } from '../cadastro-clientes/cliente-cadastro-dto';
import { ClienteService } from 'src/app/services/services/cliente.service';
import { ModalDeleteService } from 'src/app/services/services/modal-delete.service';
import { ClienteProjetoDTO } from './cliente-projeto-dto';

@Component({
  selector: 'app-visualizar-clientes',
  templateUrl: './visualizar-clientes.component.html',
  styleUrls: ['./visualizar-clientes.component.css']
})
export class VisualizarClientesComponent implements OnInit {

  termoBusca: string = '';
  mensagemBusca: string = '';
  isLoading = false;
  successMessage: string = '';
  messageTimeout: any;

  selectedCliente:any = null;
  itensPorPagina = 6;
  paginaAtual = 1;

  clientes: ClienteCadastroDTO[] = [];
  
  clientesPaginados: ClienteCadastroDTO[] = []; 
  erro: string | null = null;

  totalItens: number = 0;

  selectedLoja: any = null;


  constructor(
    private router: Router,
    private clienteService: ClienteService,
    private modalDeleteService: ModalDeleteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.exibirMensagemDeSucesso();
    this.fetchClientes();
    this.atualizarPaginacao();
  }

  cadastrarCliente(): void {
    this.router.navigate(['/usuario/cadastro-cliente']);
  }

  onSearch(searchTerm: string) {
    
  }

  atualizarPaginacao(): void { 
  }


  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  fetchClientes(): void {
    this.clienteService.obterTodosClientes().subscribe({
      next: (res) => {
        if (res && res.statusCode === 200) {
          this.clientesPaginados = res.response ?? [];
          console.log(res.response);
          this.erro = null;
        } else {
          this.erro = 'Erro ao buscar clientes.';
          this.clientesPaginados = [];
        }
      },
      error: (err) => {
        console.error('Erro na API:', err);
        this.erro = 'Erro ao conectar com o servidor.';
        this.clientesPaginados = [];
      }
    });
  }


  visualizarCliente(id: string): void {
    this.router.navigate(['/usuario/detalhes-cliente', id]);
  }

  editarCliente(id: string): void {
    this.router.navigate(['/usuario/cadastro-cliente', id]);
  }

  getInitial(name?: string): string {
    return name && name.length > 0 ? name.charAt(0).toUpperCase() : '';
  }

  getRandomColor(seed?: string): string {
    const colors = [
      '#FFB3BA', // Rosa pastel
      '#FFDFBA', // Laranja pastel
      '#BAFFC9', // Verde pastel
      '#BAE1FF', // Azul pastel
      '#D5BAFF', // Roxo pastel
    ];
    const index =
      seed && seed.length > 0 ? seed.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }

  openModalDeletar(cliente: any): void {
    this.selectedCliente = cliente;

    this.modalDeleteService.openModal(
      {
        title: 'Remoção de Cliente',
        description: `Tem certeza que deseja excluir o cliente <strong>${
          cliente.nome
        } - ${cliente.estado ?? '-'} - ${cliente.cidade}</strong>?`,
        item: cliente,
        deletarTextoBotao: 'Remover',
        size: 'md',
      },
      () => {
        this.deleteCliente(cliente.id);
      }
    );
  
  }

  deleteCliente(id:string){
    const clienteRemovido = this.clientesPaginados.find((e) => e.id === id);

    this.clienteService.deleteClientById(id).subscribe(
      () => {
        console.log('Cliente deletado com sucesso!');
        this.fetchClientes();
        this.showMessage(
          'success',
          `Cliente "${clienteRemovido?.nome ?? ''} - 
          ${ clienteRemovido?.estado ?? '-'}" - ${clienteRemovido?.cidade } deletado com sucesso!`
        );
      },
      (error) => {
        console.error('Erro ao deletar o cliente:', error);
      }
    );
  }

  
  exibirMensagemDeSucesso(): void {
    const state = window.history.state as { successMessage?: string };
    if (state?.successMessage) {
      this.successMessage = state.successMessage;
      setTimeout(() => (this.successMessage = ''), 3000);
      window.history.replaceState({}, document.title);
    }
  }

  showMessage(type: 'success' | 'error', msg: string) {
    this.clearMessage();
    if (type === 'success') this.successMessage = msg;
    this.messageTimeout = setTimeout(() => this.clearMessage(), 4000);
  }

  clearMessage() {
    this.successMessage = '';
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
  }

  onVoltarClick() {
    const rota = this.authService.getHomeRouteForRole();
    this.router.navigate([rota]);
  }
  
}
