import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { NoticiasService } from 'src/app/services/services/noticias.service';
import { UsuarioService } from 'src/app/services/services/usuario.service';
import { Noticia } from '../painel-admin/noticia';

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
  selector: 'app-painel-clientes',
  templateUrl: './painel-clientes.component.html',
  styleUrls: ['./painel-clientes.component.css']
})
export class PainelClientesComponent implements OnInit {

  quantidadeProjetosEmAndamento: number = 0; 

  
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
      private authService: AuthService,
      private usuarioService: UsuarioService
    ) { }
  
  
    ngOnInit(): void {  
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

}
