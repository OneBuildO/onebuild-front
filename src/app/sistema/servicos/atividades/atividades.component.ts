import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { ClienteService } from 'src/app/services/services/cliente.service';
import { ProjetoUsuarioDTO } from 'src/app/sistema/servicos/cadastro-projeto/projeto-usuario-dto';
import { ProjetosDisponiveisDTO } from 'src/app/sistema/servicos/cadastro-projeto/projetos-disponiveis-dto';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';

declare const google: any;

@Component({
  selector: 'app-atividades',
  templateUrl: './atividades.component.html',
  styleUrls: ['./atividades.component.css']
})
export class AtividadesComponent implements OnInit, OnDestroy {
  // listas completas vindas do back-end
  clients: ProjetoUsuarioDTO[]          = [];
  allProjects: ProjetosDisponiveisDTO[] = [];

  // arrays filtrados / variáveis de seleção
  projects: ProjetosDisponiveisDTO[]    = [];
  selectedClient!: ProjetoUsuarioDTO;
  selectedProject!: ProjetosDisponiveisDTO;

  private chart: any;
  private subs = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private projetoService: ProjetoService,
    private clienteService: ClienteService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    // carrega clientes e projetos em paralelo
    this.subs.add(
      forkJoin({
        clientes: this.projetoService.obterClientes(),
        projetos : this.projetoService.obterProjetos()
      }).subscribe(({ clientes, projetos }) => {
        this.clients     = clientes.response;
        this.allProjects = projetos.response;

        // inicializamos as seleções com o primeiro de cada lista
        if (this.clients.length) {
          this.selectedClient = this.clients[0];
          this.filterProjects();
        }
        if (this.projects.length) {
          this.selectedProject = this.projects[0];
        }

        // desenha o Gantt
        google.charts.load('current', { packages: ['gantt'] });
        google.charts.setOnLoadCallback(() =>
          this.zone.run(() => this.drawChart())
        );
      })
    );

    window.addEventListener('resize', this.redrawOnResize);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    window.removeEventListener('resize', this.redrawOnResize);
  }

  onClientChange(): void {
    this.filterProjects();
    // sempre escolha o primeiro projeto após trocar o cliente
    if (this.projects.length) {
      this.selectedProject = this.projects[0];
    }
    this.drawChart();
  }

  onVoltarClick(): void {
    this.router.navigate([ this.authService.getHomeRouteForRole() ]);
  }

  onProjectChange(): void {
    this.drawChart();
  }

  private filterProjects(): void {
    // filtra pelo nome do cliente (é assim que ProjetosDisponiveisDTO.cliente vem da API)
    this.projects = this.allProjects.filter(
      p => p.cliente === this.selectedClient.nome
    );
  }

  private drawChart(): void {
    const container = document.getElementById('gantt_chart');
    if (!container || !google?.visualization) { return; }

    const data = new google.visualization.DataTable();
    data.addColumn('string', 'ID');
    data.addColumn('string', 'Tarefa');
    data.addColumn('string', 'Recurso');
    data.addColumn('date',   'Início');
    data.addColumn('date',   'Fim');
    data.addColumn('number', 'Duração');
    data.addColumn('number', '% Concluído');
    data.addColumn('string', 'Dependências');

    // aqui você usaria ClienteService.getActivities(this.selectedProject.idProjeto)
    // para montar as linhas verdadeiras do seu Gantt.  
    // Exemplo estático:
    data.addRows([
      ['T01','Levantamento','Topografia', new Date(2025,6,1), new Date(2025,6,5), null,100,null],
      ['T02','Limpeza','Obra',             new Date(2025,6,6), new Date(2025,6,8), null,  0,'T01'],
      ['T03','Marcação','Obra',            new Date(2025,6,9), new Date(2025,6,10),null, 0,'T02']
    ]);

    const options = {
      height: data.getNumberOfRows() * 40 + 80,
      gantt: {
        trackHeight: 30,
        criticalPathEnabled: true,
        arrow:         { angle: 90, width: 2, color: '#CB8642', radius: 0 },
        labelStyle:    { fontName: 'Roboto', fontSize: 12 }
      }
    };

    if (!this.chart) {
      this.chart = new google.visualization.Gantt(container);
    }
    this.chart.draw(data, options);
  }

  private redrawOnResize = () => this.zone.run(() => this.drawChart());
}
