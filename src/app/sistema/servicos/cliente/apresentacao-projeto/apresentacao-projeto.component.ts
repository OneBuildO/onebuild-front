import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { ProjetosDisponiveisDTO } from 'src/app/sistema/servicos/cadastro-projeto/projetos-disponiveis-dto';
import { StatusDoProjetoDescricoes } from '../../cadastro-projeto/statusDoProjetoDescricoes';
import { StatusDoProjeto } from '../../cadastro-projeto/statusDoProjeto';
import { ApiResponse } from 'src/app/services/services/api-response-dto';

@Component({
  selector: 'app-apresentacao-projeto',
  templateUrl: './apresentacao-projeto.component.html',
  styleUrls: ['./apresentacao-projeto.component.css']
})
export class ApresentacaoProjetoComponent implements OnInit {
  projetos: ProjetosDisponiveisDTO[] = [];
  mensagemBusca: string = '';
  isLoading = false;
  errorMsg: string | null = null;

  itensPorPagina = 6;
  paginaAtual = 1;
  projetosPaginados: ProjetosDisponiveisDTO[] = [];
  totalPaginas = 0;
  totalItens: number = 0;

  constructor(
    private router: Router,
    private projetoService: ProjetoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchMeusProjetos();
  }

    fetchMeusProjetos(): void {
      this.isLoading = true;
  
      this.projetoService.getMeusProjetos().subscribe(
        (res: ApiResponse<ProjetosDisponiveisDTO[]>) => {
          this.projetos = res.response;
          this.totalItens = this.projetos.length; 
          this.totalPaginas = Math.ceil(
            this.projetos.length / this.itensPorPagina
          );
          console.log(res.response);
          this.atualizarPaginacao();
          this.isLoading = false;
        },
        (error) => {
          console.error('Erro ao carregar projetos:', error);
          this.isLoading = false;
        }
      );
    }

    onSearch(searchTerm: string) {
       if (!searchTerm || searchTerm.trim() === '') {
         this.mensagemBusca = '';
         this.fetchMeusProjetos();
         return;
       }
       this.isLoading = true;
       this.projetoService.buscarProjetosPorNomeLogado(searchTerm).subscribe(
         (projetos: ApiResponse<ProjetosDisponiveisDTO[]>) => {
           this.projetos = projetos.response;
           this.paginaAtual = 1;
           this.totalItens = this.projetos.length;
           this.totalPaginas = Math.ceil(
             this.projetos.length / this.itensPorPagina
           );
           this.atualizarPaginacao();
           this.isLoading = false;
           if (!projetos || projetos.response.length === 0) {
             this.mensagemBusca = 'Busca não encontrada';
           }
           this.cdr.detectChanges();
         },
         (error) => {
           console.error('Erro ao buscar colaboradores:', error);
           this.isLoading = false;
           if (error.message && error.message.includes('404')) {
             this.projetos = [];
             this.totalItens = 0;
             this.atualizarPaginacao();
             this.mensagemBusca = 'Busca não encontrada';
           }
           this.cdr.detectChanges();
         }
       );
     }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.projetosPaginados = this.projetos.slice(inicio, fim);
    this.cdr.detectChanges();
  }

  onPaginaMudou(novaPagina: number): void {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  visualizarProjeto(id: number): void {
    this.router.navigate(['/usuario/apresentacao-do-projeto', id]);
  }

  traduzirStatusDoProjeto(statusDoProjeto: string): string {
    return StatusDoProjetoDescricoes[statusDoProjeto as StatusDoProjeto];
  }

  onVoltarClick(): void {
    this.router.navigate(['/dashboard']);
  }
}
