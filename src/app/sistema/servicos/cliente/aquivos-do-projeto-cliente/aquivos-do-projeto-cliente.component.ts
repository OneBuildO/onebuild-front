import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { ClienteService } from 'src/app/services/services/cliente.service';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { ArquivosProjetoDTO } from '../../cadastro-projeto/arquivos-projetos-dto';
import { ProjetosDisponiveisDTO } from '../../cadastro-projeto/projetos-disponiveis-dto';
import { ApiResponse } from 'src/app/services/services/api-response-dto';
import { DadosService } from 'src/app/services/services/dados.service';
import { forkJoin} from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-aquivos-do-projeto-cliente',
  templateUrl: './aquivos-do-projeto-cliente.component.html',
  styleUrls: ['./aquivos-do-projeto-cliente.component.css']
})
export class AquivosDoProjetoClienteComponent implements OnInit {

  arquivosProjetos: ArquivosProjetoDTO[] = [];
  arquivosPaginados: ArquivosProjetoDTO[] = [];

  projetosCliente: ProjetosDisponiveisDTO[] = [];

  itensPorPagina = 6;
  paginaAtual = 1;
  totalPaginas = 0;
  totalItens: number = 0;

  termoBusca: string = '';
  mensagemBusca: string = '';

  isLoading:boolean = false;

  successMessage: string = '';
  messageTimeout: any;

  constructor(
    private router: Router,
    private clienteService: ClienteService,
    private authService: AuthService,
    private projetoService: ProjetoService,
    private dadosService: DadosService
  ) {}
    
  
  ngOnInit(): void {
    this.fetchArquivos();
  }
  
  onVoltarClick() {
    const rota = this.authService.getHomeRouteForRole();
    this.router.navigate([rota]);
  }
    
  fetchArquivos(): void {
    this.isLoading = true;

    this.projetoService.getMeusProjetos().pipe(
      switchMap(responseProjetos => {
      const projetos = responseProjetos.response;
      const calls = projetos.map(p =>
        this.dadosService.listarArquivosNormais(p.idProjeto).pipe(
          map(resp =>
            resp.response.map(arq => ({
              ...arq,
              nomeProjeto: p.nomeProjeto,
              dataUpload: p.dataCadastro
            }))
          )
        )
      );
        return forkJoin(calls);  // Observable<ArquivosProjetoDTO[][]>
      }),
      map((arraysDeArquivos: ArquivosProjetoDTO[][]) =>
        arraysDeArquivos.flat() // Agora vira ArquivosProjetoDTO[]
      )
    ).subscribe(
      arquivos => {
        this.arquivosProjetos = arquivos;
        this.totalItens = arquivos.length;
        this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina);
        this.atualizarPaginacao();
        this.isLoading = false;
      },
      error => {
        console.error('Erro ao carregar arquivos:', error);
        this.isLoading = false;
      }
    );
  }

  atualizarPaginacao(): void {
    const start = (this.paginaAtual - 1) * this.itensPorPagina;
    const end = start + this.itensPorPagina;
    this.arquivosPaginados = this.arquivosProjetos.slice(start, end);
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }


    /* Abre o arquivo em nova aba para visualização */
  visualizarArquivo(arquivo: ArquivosProjetoDTO): void {
    this.dadosService.downloadArquivo(arquivo.id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        // opcional: revogar depois de algum tempo
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      },
      error: () => {
        alert('Erro ao carregar pré-visualização.');
      }
    });
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

}
