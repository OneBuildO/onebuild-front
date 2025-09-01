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
import { Noticia } from '../painel-admin/noticia';
import { DadosUsuario } from 'src/app/login/dadosUsuario';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { ProjetosDisponiveisDTO } from '../../servicos/cadastro-projeto/projetos-disponiveis-dto';
import { ApiResponse } from 'src/app/services/services/api-response-dto';
import { PropostaDTO } from 'src/app/pages/proposta-fornecedor/models/propostaDTO';
import { PropostasFornecedorDTO } from 'src/app/pages/proposta-fornecedor/models/propostasFornecedorDTO';
import { PropostaFornecedorService } from 'src/app/services/services/proposta-forcecedor.service';
import { StatusPropostaDescricao } from '../../servicos/visualizar-promocoes-geral/status-proposta-descricao';
import { StatusProposta } from '../../servicos/visualizar-promocoes-geral/StatusProposta';

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
  selector: 'app-painel-fornecedor',
  templateUrl: './painel-fornecedor.component.html',
  styleUrls: ['./painel-fornecedor.component.css']
})
export class PainelFornecedorComponent implements OnInit {


  noticias: Noticia[] = [];
  usuario: Usuario | null = null;
  dadosUsuario: DadosUsuario | null = null;
  nomeUsuario: string = '';
  weatherDescription: string = 'Carregando...';
  temperature: number = 0;
  iconUrl: string = '';
  windSpeed: number = 0;
  weatherData: any = {};

  estadoUsuario: string = localStorage.getItem('dadosUsuario')
    ? JSON.parse(localStorage.getItem('dadosUsuario')!).estado
    : null;

  usuarioId: string = localStorage.getItem('dadosUsuario')
    ? JSON.parse(localStorage.getItem('dadosUsuario')!).idUsuario
    : null;

  motivationalMessage: { quote: string; author: string } = {
    quote: '',
    author: '',
  };

  isPropostaOpen: boolean = false;
  selectedProjeto: ProjetosDisponiveisDTO | null = null;

  propostaValor: number | null = null;
  propostaFile: File | null = null;
  propostaFileName: string = '';


  fornecedoresPorTipo: FornecedorPorTipo[] = [];

  totalDeArquitetos: number = 0;
  totalDeConstrutoras: number = 0;
  totalDeDesignsDeInteriores: number = 0;
  totalDeFornecedores: number = 0;

  projetos: ProjetosDisponiveisDTO[] = [];

  public Permissao = Permissao;
  cargoUsuario!: Permissao;


  propostasPaginadas: PropostasFornecedorDTO[] = [];


  constructor(
    private apiService: ClimaService,
    private noticiaService: NoticiasService,
    private motivationalMessagesService: MotivationalMessagesService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private projetoService: ProjetoService,
    private propostaService: PropostaFornecedorService
  ) { }


  ngOnInit(): void {

    this.fetchProjetosDisponiveis(this.estadoUsuario);
    this.fetchPropostasDisponiveis(this.usuarioId);
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
        this.dadosUsuario = usuario;
        this.nomeUsuario = usuario.nome;
        this.cargoUsuario = ('ROLE_' + usuario.tipoUsuario) as Permissao;
        localStorage.setItem('dadosUsuario', JSON.stringify(usuario));
      },
      (err) => {
        console.error('Erro ao carregar o perfil do usuário:', err);
      }
    );
  }

  fetchProjetosDisponiveis(estado: string) {
    this.projetoService.obterProjetoPublicoPorEstado(estado).subscribe((data: ApiResponse<ProjetosDisponiveisDTO[]>) => {
      this.projetos = data.response;
    }, (error => {
      console.error('Erro os projetos:', error);

    }))
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


  openPropostaModal(projeto: ProjetosDisponiveisDTO): void {
    this.selectedProjeto = projeto;
    this.propostaValor = null;
    this.propostaFile = null;
    this.propostaFileName = '';
    this.isPropostaOpen = true;

  }

  closePropostaModal(event?: MouseEvent): void {
    // fecha ao clicar fora do conteúdo
    if (!event || (event && (event.target as HTMLElement).classList.contains('modal-overlay'))) {
      this.isPropostaOpen = false;
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.propostaFile = input.files[0];
      this.propostaFileName = this.propostaFile.name;
    } else {
      this.propostaFile = null;
      this.propostaFileName = '';
    }
  }

  enviarProposta(): void {
    if (!this.selectedProjeto || !this.propostaValor || !this.propostaFile) return;

    const formData = new FormData();
    formData.append('valor', String(this.propostaValor));
    formData.append('arquivo', this.propostaFile);

    const propostaDTO: PropostaDTO = {
      valorDaProposta: this.propostaValor,
      arquivo: this.propostaFile,
      fornecedorId: this.usuarioId ?? '',
      projetoId: this.selectedProjeto.idProjeto
    };

    this.propostaService.enviarProposta(propostaDTO).subscribe({
      next: (data: { message: string; }) => {
        alert(data.message);
        this.propostaValor = null;
        this.propostaFile = null;
        this.propostaFileName = '';
        this.isPropostaOpen = false;
      },
      error: (error: any) => {
        alert('Erro ao enviar proposta. Tente novamente.');
        console.error('Erro ao enviar proposta:', error);
      }
    });
  }


  fetchPropostasDisponiveis(idFornecedor: string): void {
    this.propostaService.obterPropostasFornecedor(idFornecedor).subscribe({
      next: (data) => {
        this.propostasPaginadas = data;

      },
      error: (error) => {
        console.error('Erro ao carregar propostas:', error);
        alert('Erro ao carregar as propostas. Tente novamente.');
      }
    });
  }

  traduzirStatusProposta(statusProposta: string): string {
    return StatusPropostaDescricao[statusProposta as StatusProposta];
  }

  baixarProposta(url: string, nomeDoArquivo: string): void {
    if (!url) {
      console.error("URL para download não fornecida.");
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nomeDoArquivo || 'proposta.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
