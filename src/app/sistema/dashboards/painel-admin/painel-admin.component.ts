import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Usuario } from 'src/app/login/usuario';
import { DadosUsuario } from 'src/app/login/dadosUsuario';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ChartType
} from 'ng-apexcharts';

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];  //cor diferente para cada fornecedor.
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

import { Permissao } from 'src/app/login/permissao';
import { ClimaService } from 'src/app/services/services/clima.service';
import { MotivationalMessagesService } from 'src/app/services/services/MotivationalMessagesService';
import { AuthService } from 'src/app/services/services/auth.service';
import { TipoFornecedor } from 'src/app/login/tipoFornecedor';
import { Noticia } from './noticia';
import { NoticiasService } from 'src/app/services/services/noticias.service';
import { UsuarioService } from 'src/app/services/services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};

interface FornecedorPorTipo {
  tipo: TipoFornecedor;
  quantidade: number;
}

@Component({
  selector: 'app-painel-admin',
  templateUrl: './painel-admin.component.html',
  styleUrls: ['./painel-admin.component.css']
})
export class PainelAdminComponent implements OnInit {

  noticias: Noticia[] = [];
  usuario: Usuario | null = null;
  dadosUsuario: DadosUsuario | null = null;
  nomeUsuario: string = '';
  weatherDescription: string = 'Carregando...';
  temperature: number = 0;
  iconUrl: string = '';
  windSpeed: number = 0;
  weatherData: any = {};
  motivationalMessage: { quote: string; author: string } = {
    quote: '',
    author: '',
  };

  fornecedoresPorTipo: FornecedorPorTipo[] = [];

  totalDeArquitetos: number = 0;
  totalDeConstrutoras: number = 0;
  totalDeDesignsDeInteriores: number = 0;
  totalDeFornecedores: number = 0;

  public Permissao = Permissao;
  cargoUsuario!: Permissao;

  readonly conviteUrl = 'https://www.plataformaonebuild.com';


  constructor(
    private apiService: ClimaService,
    private noticiaService: NoticiasService,
    private motivationalMessagesService: MotivationalMessagesService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) { }


  ngOnInit(): void {
    this.usuarioService.getDadosEstatisticasAdmin().subscribe({
      next: dto => {
        this.totalDeArquitetos = dto.numArquitetos;
        this.totalDeConstrutoras = dto.numTotalConstrutoras;
        this.totalDeDesignsDeInteriores = dto.numTotalDesigninteriores;
        this.totalDeFornecedores = dto.numTotalFornecedores;

        // 3) converte o mapa em arrays para o donut
        const segmentos = Object.entries(dto.numFornecedoresPorSegmento) as [string, number][];
        this.donutChartFornecedores.series = segmentos.map(([, qty]) => qty);
        this.donutChartFornecedores.labels = segmentos.map(([tipo]) => this.getDescricaoTipo(tipo as TipoFornecedor));
        
        // CORES DIFERENTES PARA CADA INDICE
        this.donutChartFornecedores.colors  = segmentos.map(([,], idx) => this.donutPalette[idx] || '#CCCCCC');
      
      },
      error: err => {
        console.error('Erro carregando estatísticas', err);
      }
    });

    this.noticiaService.getNoticias().subscribe({
      next: (data) => {
        const imagensDisponiveis = [
          'arquitetura01.jpg',
          'arquitetura02.jpg',
          'fornecedores01.jpg',
          'construtora01.jpg',
          'backgroundhome.jpg',
          'backgroundhome_clean00.png',
          'backgroundhome_clean.png',
          'backgroundhome.png',
          'predios01.png',
          'predios02.png',
          'predios03.png',
          'predios04.png'
        ];

        this.noticias = data.map((noticia, index) => ({
          ...noticia,
          imagem: 'assets/imagens/' + imagensDisponiveis[index % imagensDisponiveis.length]
        }));
      },
      error: () => this.noticias = []
    });
    this.getWeatherForCurrentLocation();
    this.motivationalMessage =
      this.motivationalMessagesService.getRandomMessage();
    // this.carregarDistribuicaoMock();
    this.authService.obterPerfilUsuario().subscribe(
      (usuario) => {
        this.nomeUsuario = usuario.nome;
        this.cargoUsuario = ('ROLE_' + usuario.tipoUsuario) as Permissao;
        this.dadosUsuario = usuario;
        localStorage.setItem('dadosUsuario', JSON.stringify(usuario));
      },
      (err) => {
        console.error('Erro ao carregar o perfil do usuário:', err);
      }
    );
  }

  // carregarDistribuicaoMock(): void {
  // const mock: FornecedorPorTipo[] = [
  // { tipo: TipoFornecedor.VIDRACARIA, quantidade: 8 },
  // { tipo: TipoFornecedor.MARCENARIA, quantidade: 12 },
  // { tipo: TipoFornecedor.ILUMINACAO, quantidade: 5 },
  // { tipo: TipoFornecedor.REVESTIMENTOS, quantidade: 7 },
  // { tipo: TipoFornecedor.AUTOMACAO, quantidade: 3 }
  // ];

  //   this.fornecedoresPorTipo = mock;

  //   this.donutChartFornecedores.series = mock.map(item => item.quantidade);
  //   this.donutChartFornecedores.labels = mock.map(item => this.getDescricaoTipo(item.tipo));
  // }

  onLinkCopiado(sucesso: boolean) {
    this.snackBar.open(
      sucesso ? 'Link copiado para a área de transferência.' : 'Não foi possível copiar o link.',
      'OK',
      { duration: 3000 }
    );
  }

  getDescricaoTipo(tipo: TipoFornecedor): string {
    const TipoFornecedorDescricoes: Record<TipoFornecedor, string> = {
      [TipoFornecedor.VIDRACARIA]: 'Vidraçaria',
      [TipoFornecedor.MARMORARIA]: 'Marmoraria',
      [TipoFornecedor.ESQUADRIA]: 'Esquadria',
      [TipoFornecedor.AUTOMACAO]: 'Automação',
      [TipoFornecedor.MARCENARIA]: 'Marcenaria',
      [TipoFornecedor.MADEREIRA]: 'Madereira',
      [TipoFornecedor.ELETRICA]: 'Elétrica',
      [TipoFornecedor.CLIMATIZACAO]: 'Climatização',
      [TipoFornecedor.HIDRAULICA]: 'Hidráulica',
      [TipoFornecedor.GESSO]: 'Gesso',
      [TipoFornecedor.ILUMINACAO]: 'Iluminação',
      [TipoFornecedor.REVESTIMENTOS]: 'Revestimentos',
      [TipoFornecedor.FERRAGEM]: 'Ferragem',
      [TipoFornecedor.OUTROS]: 'Outros'
    };
    return TipoFornecedorDescricoes[tipo] || 'Desconhecido';
  }



  getWeatherForRussas(): void {
    this.apiService.fetchWeatherForRussas().subscribe((data) => {
      this.weatherData = data;
      console.log(this.weatherData);
      this.updateWeatherInfo();
    });
  }

  getWeatherForCurrentLocation(): void {
    this.apiService.fetchWeatherForCurrentLocation().subscribe(
      (data) => {
        this.weatherData = data;
        console.log(this.weatherData);
        this.updateWeatherInfo();
      },
      (error) => {
        console.error('Error getting location', error);
        this.getWeatherForRussas();
      }
    );
  }

  getWeatherForLocation(lat: number, lon: number): void {
    this.apiService.fetchWeather(lat, lon).subscribe((data) => {
      this.weatherData = data;
      console.log(this.weatherData);
      this.updateWeatherInfo();
    });
  }

  updateWeatherInfo(): void {
    if (this.weatherData) {
      this.weatherDescription = this.weatherData.weather[0].description;
      this.temperature = Math.round(this.weatherData.main.temp);
      this.iconUrl = `https://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}.png`;
      this.windSpeed = this.weatherData.wind.speed;
      this.cdr.detectChanges();
    }
  }

  //cores usadas para cada tipo de fornecedor
  private donutPalette = [
    '#008FFB', 
    '#00E396',
    '#FEB019',
    '#FF4560',
    '#775DD0',
    '#546E7A',
    '#26a69a',
    '#D10CE8',
    '#A0E7E5',
    '#FF8C00',
    '#8B0000',
    '#006400',
    '#800080',
    '#FFC0CB',
  ];


  donutChartFornecedores: DonutChartOptions = {
    series: [],
    chart: { type: 'donut', height: 350, },
    labels: [],
    colors: this.donutPalette,  // ← aplica cores à fatias
    dataLabels: { enabled: true },
    legend: { position: 'bottom' },
    title: { text: 'Fornecedores por Segmento' },
  };

  barChartProjetosPorCidade: BarChartOptions = {
    series: [
      {
        name: 'Projetos',
        data: [12, 8, 15, 6, 9]
      }
    ],
    chart: {
      type: 'bar',
      height: 350
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: ['Fortaleza', 'Russas', 'Quixadá', 'Sobral', 'Juazeiro']
    },
    title: {
      text: 'Projetos por Cidade'
    }
  };



}
