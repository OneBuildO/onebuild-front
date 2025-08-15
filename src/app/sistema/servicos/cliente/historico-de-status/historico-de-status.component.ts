import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { ProjetoHistorico } from 'src/app/pages/projetos/models/ProjetoHistorico';
import { StatusDoProjetoDescricoes } from '../../cadastro-projeto/statusDoProjetoDescricoes';
import { StatusDoProjeto } from '../../cadastro-projeto/statusDoProjeto';
import { ApiResponse } from 'src/app/services/services/api-response-dto';
import { ProjetosDisponiveisDTO } from '../../cadastro-projeto/projetos-disponiveis-dto';
import { UsuarioService } from 'src/app/services/services/usuario.service';
import { ClienteService } from 'src/app/services/services/cliente.service';

@Component({
  selector: 'app-historico-de-status',
  templateUrl: './historico-de-status.component.html',
  styleUrls: ['./historico-de-status.component.css'],
})
export class HistoricoDeStatusComponent implements OnInit {
  projetos: ProjetoHistorico[] = [];
  projetosPaginados: ProjetoHistorico[] = []; 
  mensagemBusca: string = '';
  isLoading = false;
  errorMsg: string | null = null;

  // Paginação
  itensPorPagina: number = 6;
  paginaAtual: number = 1;
  totalPaginas: number = 0;
  totalItens: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private projetoService: ProjetoService,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.isLoading = true;
    this.errorMsg = null;

    this.projetoService.obterProjetosParaTabela().subscribe({
      next: (res) => {
        this.projetos = res;
        this.totalItens = this.projetos.length;
        this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina);
        this.atualizarPaginacao();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err.message || 'Erro ao carregar os projetos.';
        this.isLoading = false;
      },
    });
  }

  onSearch(searchTerm: string): void {
    if (!searchTerm || searchTerm.trim() === '') {
      this.mensagemBusca = '';
      this.carregarProjetos();
      return;
    }

    this.isLoading = true;

    this.clienteService.buscarProjetosPorNomeLogado(searchTerm).subscribe(
      (cliente: ApiResponse<ProjetoHistorico[]>) => {
        this.projetos = cliente.response;
        this.paginaAtual = 1;
        this.totalItens = this.projetos.length;
        this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina);
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
          this.totalPaginas = 0;
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

  onPaginaMudou(novaPagina: number): void {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  onVoltarClick(): void {
    const rota = this.authService.getHomeRouteForRole();
    this.router.navigate([rota]);
  }

  visualizarProjeto(id: number): void {
    this.router.navigate(['/usuario/detalhes-progresso-projeto/', id]);
  }

  traduzirProjeto(status: string): string {
    return StatusDoProjetoDescricoes[status as StatusDoProjeto];
  }
}
