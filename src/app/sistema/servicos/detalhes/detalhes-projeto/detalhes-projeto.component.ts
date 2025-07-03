import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { ProjetoResumoDTO } from 'src/app/sistema/servicos/cadastro-projeto/projeto-resumo-dto';
import { DetalheProjetoDTO } from 'src/app/sistema/servicos/cadastro-projeto/detalhe-projeto-dto';
import { ArquivosProjetoDTO } from 'src/app/sistema/servicos/cadastro-projeto/arquivos-projetos-dto';
import { ApiResponse } from 'src/app/services/services/api-response-dto';
import { DadosService } from 'src/app/services/services/dados.service';
import { StatusDoProjetoDescricoes } from '../../cadastro-projeto/statusDoProjetoDescricoes';
import { StatusDoProjeto } from '../../cadastro-projeto/statusDoProjeto';
import { TipoFornecedorDescricoes } from 'src/app/login/tipoFornecedorDescricoes';
import { TipoFornecedor } from 'src/app/login/tipoFornecedor';

@Component({
  selector: 'app-detalhes-projeto',
  templateUrl: './detalhes-projeto.component.html',
  styleUrls: ['./detalhes-projeto.component.css']
})
export class DetalhesProjetoComponent implements OnInit {
  @Input() projetoIdInput?: number

  detalheProjeto?: DetalheProjetoDTO;
  projetoResumo?: ProjetoResumoDTO;

  arquivosNormais: ArquivosProjetoDTO[] = [];
  plantasBaixas: ArquivosProjetoDTO[] = [];

  projetoId!: number;
  carregando: boolean = true;
  erro?: string;

  rotaOrigem: 'visualizar-projeto' | 'apresentacao-do-projeto' = 'visualizar-projeto';


  constructor(
    private projetoService: ProjetoService,
    private route: ActivatedRoute,
    private dadosService: DadosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const url = this.router.url;
    if (url.startsWith('/usuario/apresentacao-do-projeto/')) {
      this.rotaOrigem = 'apresentacao-do-projeto';
    } else if (url.startsWith('/usuario/visualizar-projeto/')) {
      this.rotaOrigem = 'visualizar-projeto';
    }

    this.projetoId = this.projetoIdInput ?? Number(this.route.snapshot.paramMap.get('id'));
    if (this.projetoId) {
      this.carregarDetalhes();
    }
  }

  carregarDetalhes(): void {
    this.projetoService.obterDetalheProjeto(this.projetoId).subscribe({
      next: (res: ApiResponse<DetalheProjetoDTO>) => {
        this.detalheProjeto = res.response;
        this.carregarProjetoResumo();
        this.carregarArquivosProjeto();
      },
      error: () => {
        this.erro = "Erro ao carregar os detalhes do projeto.";
        this.carregando = false;
      }
    });
  }

  carregarProjetoResumo(): void {
    this.projetoService.obterProjeto(this.projetoId).subscribe({
      next: (res: ApiResponse<ProjetoResumoDTO>) => {
        this.projetoResumo = res.response;
        this.carregando = false;
      },
      error: () => {
        this.erro = "Erro ao carregar informações do projeto.";
        this.carregando = false;
      }
    });
  }

  carregarArquivosProjeto(): void {
    this.dadosService.listarArquivosNormais(this.projetoId).subscribe({
      next: (res) => {
        this.arquivosNormais = res.response || [];
        console.log(this.arquivosNormais);
      },
      error: () => {
        this.erro = "Erro ao carregar arquivos.";
      }
    });

    this.dadosService.listarPlantasBaixas(this.projetoId).subscribe({
      next: (res) => {
        this.plantasBaixas = res.response || [];
        console.log(this.plantasBaixas)
      },
      error: () => {
        this.erro = "Erro ao carregar plantas baixas.";
      }
    });
  }

  baixarArquivo(id: number, nomeArquivo: string): void {
    this.dadosService.downloadArquivo(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomeArquivo;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Erro ao baixar o arquivo.');
      }
    });
  }

  baixarPlantaBaixa(id: number, nomeArquivo: string): void {
    this.dadosService.downloadPlantaBaixa(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomeArquivo;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Erro ao baixar a planta baixa.');
      }
    });
  }

  traduzirVisibilidade(statusVisibilidade: boolean): string {
    return statusVisibilidade ? "Público" : "Privado" 
  }

  traduzirStatusProjeto(statusProjeto: string): string {
    return StatusDoProjetoDescricoes[statusProjeto as StatusDoProjeto];
  }

  traduzirCategoriaProjeto(categoriaProjeto: string): string {
    return TipoFornecedorDescricoes[categoriaProjeto as TipoFornecedor];
  }

  onVoltar(): void {
    this.router.navigate([`/usuario/${this.rotaOrigem}`]);
  }

}