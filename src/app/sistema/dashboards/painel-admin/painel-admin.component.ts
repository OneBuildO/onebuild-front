import { Component, OnInit,  ChangeDetectorRef  } from '@angular/core';
import { Usuario } from 'src/app/login/usuario';
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
  
    constructor(
      private apiService: ClimaService,
      private noticiaService: NoticiasService,
      private motivationalMessagesService: MotivationalMessagesService,
      private cdr: ChangeDetectorRef,
      private usuarioService: AuthService,
    ) {}
  
  
    ngOnInit(): void {
      this.noticiaService.getNoticias().subscribe({
      next: (data) => {this.noticias = data; console.log(this.noticias);},
      error: () => this.noticias = []
      });

      this.getWeatherForCurrentLocation();
      this.motivationalMessage =
      this.motivationalMessagesService.getRandomMessage();
      this.carregarDistribuicaoMock();
       this.usuarioService.obterPerfilUsuario().subscribe(
    (usuario) => {
      this.usuario = usuario;
      this.nomeUsuario = usuario.nome;
      this.cargoUsuario = ('ROLE_' + usuario.tipoUsuario) as Permissao;
      console.log('Usuário logado:', this.nomeUsuario);
    },
    (err) => {
      console.error('Erro ao carregar o perfil do usuário:', err);
    }
  );
    }

    carregarDistribuicaoMock(): void {
    const mock: FornecedorPorTipo[] = [
    { tipo: TipoFornecedor.VIDRACARIA, quantidade: 8 },
    { tipo: TipoFornecedor.MARCENARIA, quantidade: 12 },
    { tipo: TipoFornecedor.ILUMINACAO, quantidade: 5 },
    { tipo: TipoFornecedor.REVESTIMENTOS, quantidade: 7 },
    { tipo: TipoFornecedor.AUTOMACAO, quantidade: 3 }
    ];

      this.fornecedoresPorTipo = mock;

      this.donutChartFornecedores.series = mock.map(item => item.quantidade);
      this.donutChartFornecedores.labels = mock.map(item => this.getDescricaoTipo(item.tipo));
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
        this.iconUrl = `http://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}.png`;
        this.windSpeed = this.weatherData.wind.speed;
        this.cdr.detectChanges();
      }
    }

    donutChartFornecedores: DonutChartOptions = {
    series: [],
    chart: {
      type: 'donut',
      height: 350
    },
    labels: [],
    dataLabels: {
      enabled: true
    },
    legend: {
      position: 'bottom'
    },
    title: {
      text: 'Fornecedores por Segmento'
    }
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
