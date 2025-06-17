import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';

import { TipoFornecedor } from 'src/app/login/tipoFornecedor';

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

  fornecedorSelecionado: any = null;
  fornecedoresFiltrados: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
    
  ngOnInit(): void {
        
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

  // Simulação de filtragem 
  const todos = [...this.fornecedoresLocais, ...this.fornecedoresRecomendados];

  this.fornecedoresFiltrados = todos.filter(f =>
    tiposSelecionados.includes(f.tipoFornecedor) 
  );

  this.mostrarFiltro = false;
  }


  limparFiltro(): void {
  this.tiposDeFornecedores.forEach(tipo => tipo.selecionado = false);
  }


  // DADOS SIMULADOS

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

fornecedoresRecomendados = [
  {
    nome: 'Luminar Iluminação',
    cidade: 'Fortaleza',
    estado: 'Ceará',
    nota: 4.8,
    tipoFornecedor: TipoFornecedor.ILUMINACAO
  },
  {
    nome: 'Gesso & Arte',
    cidade: 'Natal',
    estado: 'Rio Grande do Norte',
    nota: 4.6,
    tipoFornecedor: TipoFornecedor.GESSO
  },
  {
    nome: 'VidroTop',
    cidade: 'Recife',
    estado: 'Pernambuco',
    nota: 4.9,
    tipoFornecedor: TipoFornecedor.VIDRACARIA
  },
  {
    nome: 'Design Mármore',
    cidade: 'Salvador',
    estado: 'Bahia',
    nota: 4.7,
    tipoFornecedor: TipoFornecedor.MARMORARIA
  },
  {
    nome: 'TecnoClima',
    cidade: 'João Pessoa',
    estado: 'Paraíba',
    nota: 4.5,
    tipoFornecedor: TipoFornecedor.CLIMATIZACAO
  },
  {
    nome: 'Esquadrias Sul',
    cidade: 'Porto Alegre',
    estado: 'Rio Grande do Sul',
    nota: 4.6,
    tipoFornecedor: TipoFornecedor.ESQUADRIA
  },
  {
    nome: 'Revest Mais',
    cidade: 'São Paulo',
    estado: 'São Paulo',
    nota: 4.7,
    tipoFornecedor: TipoFornecedor.REVESTIMENTOS
  },
  {
    nome: 'Marcenaria Moderna',
    cidade: 'Belo Horizonte',
    estado: 'Minas Gerais',
    nota: 4.8,
    tipoFornecedor: TipoFornecedor.MARCENARIA
  },
  {
    nome: 'Hidro Conecta',
    cidade: 'Curitiba',
    estado: 'Paraná',
    nota: 4.5,
    tipoFornecedor: TipoFornecedor.HIDRAULICA
  },
  {
    nome: 'Automatec',
    cidade: 'Campinas',
    estado: 'São Paulo',
    nota: 4.4,
    tipoFornecedor: TipoFornecedor.AUTOMACAO
  }
];


fornecedoresLocais = [
  {
    nome: 'InstalArt Elétrica',
    cidade: 'Russas',
    estado: 'Ceará',
    nota: 4.2,
    tipoFornecedor: TipoFornecedor.ELETRICA
  },
  {
    nome: 'Madeiras do Vale',
    cidade: 'Russas',
    estado: 'Ceará',
    nota: 4.3,
    tipoFornecedor: TipoFornecedor.MADEREIRA
  },
  {
    nome: 'Constrular',
    cidade: 'Russas',
    estado: 'Ceará',
    nota: 4.1,
    tipoFornecedor: TipoFornecedor.OUTROS
  },
  {
    nome: 'Gesso Ideal',
    cidade: 'Russas',
    estado: 'Ceará',
    nota: 4.4,
    tipoFornecedor: TipoFornecedor.GESSO
  },
  {
    nome: 'ClimaFrio Refrigeração',
    cidade: 'Russas',
    estado: 'Ceará',
    nota: 4.0,
    tipoFornecedor: TipoFornecedor.CLIMATIZACAO
  },
  {
    nome: 'Luz Forte Iluminação',
    cidade: 'Russas',
    estado: 'Ceará',
    nota: 4.3,
    tipoFornecedor: TipoFornecedor.ILUMINACAO
  },
  {
    nome: 'Top Vidraçaria',
    cidade: 'Russas',
    estado: 'Ceará',
    nota: 4.5,
    tipoFornecedor: TipoFornecedor.VIDRACARIA
  },
  {
    nome: 'Esquadrias Russas',
    cidade: 'Russas',
    estado: 'Ceará',
    nota: 4.2,
    tipoFornecedor: TipoFornecedor.ESQUADRIA
  },
  {
    nome: 'Marcenaria São José',
    cidade: 'Russas',
    estado: 'Ceará',
    nota: 4.1,
    tipoFornecedor: TipoFornecedor.MARCENARIA
  },
  {
    nome: 'Hidrossol',
    cidade: 'Russas',
    estado: 'Ceará',
    nota: 4.3,
    tipoFornecedor: TipoFornecedor.HIDRAULICA
  }
];


}
