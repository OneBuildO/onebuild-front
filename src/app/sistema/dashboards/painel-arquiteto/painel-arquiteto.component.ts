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
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

import { Permissao } from 'src/app/login/permissao';
import { ClimaService } from 'src/app/services/services/clima.service';
import { MotivationalMessagesService } from 'src/app/services/services/MotivationalMessagesService';
import { AuthService } from 'src/app/services/services/auth.service';
import { ClienteService } from 'src/app/services/services/cliente.service';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { DadosUsuario } from 'src/app/login/dadosUsuario';
import { MatSnackBar } from '@angular/material/snack-bar';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};
@Component({
  selector: 'app-painel-arquiteto',
  templateUrl: './painel-arquiteto.component.html',
  styleUrls: ['./painel-arquiteto.component.css']
})
export class PainelArquitetoComponent implements OnInit {
  readonly conviteUrl = 'https://www.plataformaonebuild.com';
  usuario: Usuario | null = null;
  nomeUsuario: string = '';
  weatherDescription: string = 'Carregando...';
  temperature: number = 0;
  dadosUsuario: DadosUsuario | null = null;
  iconUrl: string = '';
  windSpeed: number = 0;
  weatherData: any = {};
  motivationalMessage: { quote: string; author: string } = {
    quote: '',
    author: '',
  };

  totalDeClientes: number = 0;
  projetosEmCotacao: number = 0;
  projetosEmAndamento: number = 0;
  projetosFinalizados: number = 0;

  public Permissao = Permissao;
  cargoUsuario!: Permissao;

  constructor(
    private apiService: ClimaService,
    private motivationalMessagesService: MotivationalMessagesService,
    private cdr: ChangeDetectorRef,
    private usuarioService: AuthService,
    private authService: AuthService,
    private clienteService: ClienteService,
    private projetoService: ProjetoService,
    private snackBar: MatSnackBar
  ) { }


  ngOnInit(): void {
    this.getWeatherForCurrentLocation();
    this.motivationalMessage =
      this.motivationalMessagesService.getRandomMessage();
    this.authService.obterPerfilUsuario().subscribe(
      (usuario) => {
        this.dadosUsuario = usuario;
        this.nomeUsuario = usuario.nome;
        this.cargoUsuario = ('ROLE_' + usuario.tipoUsuario) as Permissao;
        localStorage.setItem('dadosUsuario', JSON.stringify(usuario));
        console.log('Usuário logado:', this.nomeUsuario);
      },
      (err) => {
        console.error('Erro ao carregar o perfil do usuário:', err);
      }
    );
    this.carregarClientesPorMes();
    this.carregarProjetosPorStatus();
    this.carregarProjetosPorMes();
    this.obterTotalClientes();
  }

  onLinkCopiado(sucesso: boolean) {
    this.snackBar.open(
      sucesso ? 'Link copiado para a área de transferência.' : 'Não foi possível copiar o link.',
      'OK',
      { duration: 3000 }
    );
  }

  carregarClientesPorMes(): void {
    this.clienteService.obterClientesPorMes(new Date().getFullYear()).subscribe({
      next: (meses) => {
        console.log('Clientes por mês:', meses);
        this.clientesPorMesChart.series = [{
          name: "Clientes",
          data: meses
        }];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar clientes por mês:', err)
    });
  }

  obterTotalClientes(): void {
    this.clienteService.obterTotalClientes().subscribe({
      next: (total : number) => {
        this.totalDeClientes = total;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao obter total de clientes:', err)
    });
  }

  carregarProjetosPorStatus(): void {
    this.projetoService.obterProjetosPorStatus().subscribe({
      next: (data) => {
        this.projetosPorStatusChart.series = [
          data['NOVO_PROJETO'] ?? 0,
          data['EM_COTACAO'] ?? 0,
          data['EM_ANDAMENTO'] ?? 0,
          data['FINALIZADO'] ?? 0
        ];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar projetos por status:', err)
    });
  }

  carregarProjetosPorMes(): void {
    this.projetoService.obterProjetosPorMes(new Date().getFullYear()).subscribe({
      next: (meses) => {
        this.projetosPorMesChart.series = [{
          name: "Projetos",
          data: meses
        }];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar projetos por mês:', err)
    });
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


  clientesPorMesChart: BarChartOptions = {
    series: [
      {
        name: "Clientes",
        data: [12, 19, 8, 15, 20, 10, 25, 30, 22, 18, 26, 29]
      }
    ],
    chart: {
      type: 'bar' as ChartType,
      height: 350
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
      ]
    },
    title: {
      text: 'Clientes por Mês',
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#4b504b'
      }
    }
  };

  projetosPorStatusChart: DonutChartOptions = {
    series: [5, 2, 10, 7],
    chart: {
      type: 'donut' as ChartType,
      height: 350
    },
    labels: ["Novo Projeto", "Em Cotação", "Em Andamento", "Finalizado"],
    dataLabels: {
      enabled: true
    },
    legend: {
      position: 'bottom' as const
    },
    title: {
      text: 'Projetos por Status',
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#4b504b'
      }
    }
  };


  projetosPorMesChart: BarChartOptions = {
    series: [
      {
        name: "Projetos",
        data: [5, 8, 6, 12, 14, 10, 9, 15, 11, 13, 7, 16] // dados mockados
      }
    ],
    chart: {
      type: 'bar' as ChartType,
      height: 350
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
      ]
    },
    title: {
      text: 'Projetos por Mês',
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#4b504b'
      }
    }
  };





}
