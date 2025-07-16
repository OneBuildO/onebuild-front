import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { ModalDeleteService } from 'src/app/services/services/modal-delete.service';
import { ProjetosDisponiveisDTO } from '../cadastro-projeto/projetos-disponiveis-dto';
import { StatusDoProjeto } from '../cadastro-projeto/statusDoProjeto';
import { StatusDoProjetoDescricoes } from '../cadastro-projeto/statusDoProjetoDescricoes';
import { ApiResponse } from 'src/app/services/services/api-response-dto';
import { ProjetoService } from 'src/app/services/services/projeto.service';

@Component({
  selector: 'app-visualizar-projeto',
  templateUrl: './visualizar-projeto.component.html',
  styleUrls: ['./visualizar-projeto.component.css']
})
export class VisualizarProjetoComponent implements OnInit {

  termoBusca: string = '';
  mensagemBusca: string = '';
  isLoading = false;
  successMessage: string = '';
  messageTimeout: any;


  itensPorPagina = 6;
  paginaAtual = 1;

  projetos: ProjetosDisponiveisDTO[] = [];
  projetosPaginados: ProjetosDisponiveisDTO[] = [];
  totalPaginas = 0;

  totalItens: number = 0;

  selectedProjeto: any = null;


  constructor(
    private router: Router,
    private modalDeleteService: ModalDeleteService,
    private authService: AuthService,
    private projetoService: ProjetoService,
  ) {}

  ngOnInit(): void {
    this.exibirMensagemDeSucesso();
    this.fetchProjetos();
  }

  cadastrarProjeto(): void {
    this.router.navigate(['/usuario/cadastro-projeto']);
  }

  onSearch(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.mensagemBusca = '';
      this.fetchProjetos();
      return;
    }
    this.isLoading = true;
    this.projetoService.buscarProjetosPorNome(searchTerm).subscribe(
      (cliente: ApiResponse<ProjetosDisponiveisDTO[]>) => {
        this.projetos = cliente.response;
        this.paginaAtual = 1;
        this.totalItens = this.projetos.length;
        this.totalPaginas = Math.ceil(
          this.projetos.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
        if (!cliente || cliente.response.length === 0) {
          this.mensagemBusca = 'Busca não encontrada';
        }
      },
      (error) => {
        console.error('Erro ao buscar clientes:', error);
        this.isLoading = false;
        if (error.message && error.message.includes('404')) {
          this.projetos = [];
          this.totalItens = 0; 
          this.atualizarPaginacao();
          this.mensagemBusca = 'Busca não encontrada';
        }
      }
    );
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.projetosPaginados = this.projetos.slice(inicio, fim);
  }


  onPaginaMudou(novaPagina: number) {
      this.paginaAtual = novaPagina;
      this.atualizarPaginacao();
  }


    fetchProjetos(): void {
      this.isLoading = true;
  
      this.projetoService.obterProjetos().subscribe(
        (res: ApiResponse<ProjetosDisponiveisDTO[]>) => {
          this.projetos = res.response;
          this.totalItens = this.projetos.length; 
          this.totalPaginas = Math.ceil(
            this.projetos.length / this.itensPorPagina
          );
          this.atualizarPaginacao();
          this.isLoading = false;
        },
        (error) => {
          console.error('Erro ao carregar projetos:', error);
          this.isLoading = false;
        }
      );
    }

  traduzirStatusDoProjeto(statusProjeto: string): string {
    return StatusDoProjetoDescricoes[statusProjeto as StatusDoProjeto];
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

  openModalDeletar(projeto: any): void {
    this.selectedProjeto = projeto;
    this.modalDeleteService.openModal(
      {
        title: 'Remoção de Projeto',
        description: `Tem certeza que deseja excluir o projeto <strong>${
          projeto.nomeProjeto
        } - ${projeto.estado ?? '-'} - ${projeto.cidade}</strong>?`,
        item: projeto,
        deletarTextoBotao: 'Remover',
        size: 'md',
      },
      () => {
        console.log(this.selectedProjeto);
        this.deleteProjeto(projeto.idProjeto);
      }
    );
  }

  visualizarProjeto(id: number): void {
    this.router.navigate(['/usuario/detalhes-projeto', id]);
  }

  editarProjeto(id: number): void {
    this.router.navigate(['/usuario/cadastro-projeto', id]);
  }

  deleteProjeto(id:number){
    const projetoRemovido = this.projetosPaginados.find((e) => e.idProjeto === id);

    this.projetoService.deletarProjeto(id).subscribe(
      () => {
        console.log('Projeto deletado com sucesso!');
        this.fetchProjetos(); // Re-fetch projects to update the list and pagination
        this.showMessage(
          'success',
          `Projeto "${projetoRemovido?.nomeProjeto ?? ''} -
          ${ projetoRemovido?.estado ?? '-'}" - ${projetoRemovido?.cidade } deletado com sucesso!`
        );
      },
      (error) => {
        console.error('Erro ao deletar o projeto:', error);
      }
    );
  }

    exibirMensagemDeSucesso(): void {
      const state = window.history.state as { successMessage?: string };
      if (state?.successMessage) {
        this.successMessage = state.successMessage;
        setTimeout(() => (this.successMessage = ''), 6000);
        window.history.replaceState({}, document.title);
      }
    }

    showMessage(type: 'success' | 'error', msg: string) {
      this.clearMessage();
      if (type === 'success') this.successMessage = msg;
      this.messageTimeout = setTimeout(() => this.clearMessage(), 6000);
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