import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';

import { TipoFornecedor } from 'src/app/login/tipoFornecedor';
import { FornecedorService } from 'src/app/services/services/fornecedor.service';
import { Fornecedor } from 'src/app/pages/fornecedor/models/Fornecedor';
import { TipoFornecedorDescricoes } from 'src/app/login/tipoFornecedorDescricoes';

export interface TipoFornecedorFiltro {
  tipo: TipoFornecedor;
  descricao: string;
  selecionado: boolean;
}

@Component({
  selector: 'app-visualizar-fornecedores',
  templateUrl: './visualizar-fornecedores.component.html',
  styleUrls: ['./visualizar-fornecedores.component.css']
})
export class VisualizarFornecedoresComponent implements OnInit {

  mostrarFiltro = false;
  paginaRecomendados = 1;
  paginaLocais = 1;
  itensPorPagina = 3;

  fornecedorSelecionado: Fornecedor | null = null;
  fornecedoresFiltrados: Fornecedor[] = [];
  fornecedoresRecomendados: Fornecedor[] = [];
  fornecedoresLocais: Fornecedor[] = [];
  cidadeUsuarioLogado: string = JSON.parse(localStorage.getItem('dadosUsuario') || '{}').cidade || '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private fornecedorService: FornecedorService
  ) { }

  ngOnInit(): void {
    this.fetchAllFornecedores();
    this.fetchFornecedoresPorCidade(this.cidadeUsuarioLogado);
  }

  abrirDetalhes(fornecedor: any) {
    this.fornecedorSelecionado = fornecedor;
  }

  get fornecedoresRecomendadosPaginados() {
    const inicio = (this.paginaRecomendados - 1) * this.itensPorPagina;
    return this.fornecedoresRecomendados.slice(inicio, inicio + this.itensPorPagina);
  }

  get fornecedoresLocaisPaginados() {
    const inicio = (this.paginaLocais - 1) * this.itensPorPagina;
    return this.fornecedoresLocais.slice(inicio, inicio + this.itensPorPagina);
  }

  get totalPaginasRecomendados() {
    return Math.ceil(this.fornecedoresRecomendados.length / this.itensPorPagina);
  }

  get totalPaginasLocais() {
    return Math.ceil(this.fornecedoresLocais.length / this.itensPorPagina);
  }


  onVoltarClick() {
    const rota = this.authService.getHomeRouteForRole();
    this.router.navigate([rota]);
  }

  aplicarFiltro(): void {
    const tiposSelecionados = this.tiposDeFornecedores
      .filter(t => t.selecionado)
      .map(t => t.tipo);

    const todos = [...this.fornecedoresLocais, ...this.fornecedoresRecomendados];

    this.fornecedoresFiltrados = todos.filter(f =>
      tiposSelecionados.includes(f.tipoFornecedor as TipoFornecedor)
    );

    this.mostrarFiltro = false;
  }


  limparFiltro(): void {
    this.tiposDeFornecedores.forEach(tipo => tipo.selecionado = false);
  }


  tiposDeFornecedores: TipoFornecedorFiltro[] = [
    { tipo: TipoFornecedor.VIDRACARIA, descricao: 'Vidraçaria', selecionado: false },
    { tipo: TipoFornecedor.MARMORARIA, descricao: 'Marmoraria', selecionado: false },
    { tipo: TipoFornecedor.ESQUADRIA, descricao: 'Esquadria', selecionado: false },
    { tipo: TipoFornecedor.AUTOMACAO, descricao: 'Automação', selecionado: false },
    { tipo: TipoFornecedor.MARCENARIA, descricao: 'Marcenaria', selecionado: false },
    { tipo: TipoFornecedor.MADEREIRA, descricao: 'Madereira', selecionado: false },
    { tipo: TipoFornecedor.ELETRICA, descricao: 'Elétrica', selecionado: false },
    { tipo: TipoFornecedor.CLIMATIZACAO, descricao: 'Climatização', selecionado: false },
    { tipo: TipoFornecedor.HIDRAULICA, descricao: 'Hidráulica', selecionado: false },
    { tipo: TipoFornecedor.GESSO, descricao: 'Gesso', selecionado: false },
    { tipo: TipoFornecedor.ILUMINACAO, descricao: 'Iluminação', selecionado: false },
    { tipo: TipoFornecedor.REVESTIMENTOS, descricao: 'Revestimentos', selecionado: false },
    { tipo: TipoFornecedor.FERRAGEM, descricao: 'Ferragem', selecionado: false },
    { tipo: TipoFornecedor.OUTROS, descricao: 'Outros', selecionado: false }
  ];

  fetchAllFornecedores() {
    this.fornecedorService.getFornecedores().subscribe((data: Fornecedor[]) => {
      this.fornecedoresRecomendados = data;

    }, (error => {
      console.error('Erro ao carregar todos os fornecedores:', error);

    }))
  }

  fetchFornecedoresPorCidade(cidade: string) {
    this.fornecedorService.getFornecedoresPorCidade(cidade).subscribe((data: Fornecedor[]) => {
      this.fornecedoresLocais = data;
    }, (error => {
      console.error('Erro ao carregar fornecedores por cidade:', error);
    }))
  }

  traduzirTipoFornecedor(tipoFornecedor: string): string {
    return TipoFornecedorDescricoes[tipoFornecedor as TipoFornecedor];

  }

}
