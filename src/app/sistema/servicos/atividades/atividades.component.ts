import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/services/auth.service';

declare const google: any;

@Component({
  selector: 'app-atividades',
  templateUrl: './atividades.component.html',
  styleUrls: ['./atividades.component.css']
})
export class AtividadesComponent implements OnInit, OnDestroy {
  // Fake data para demonstração
  clients = [
    {
      id: '1',
      nome: 'lucas',
      projetos: [
        { id: 1, nome: 'casa de praia', cidade: 'Ubatuba', estado: 'SP', status: 'Em andamento' }
      ]
    }
  ];
  projects = this.clients[0].projetos;
  selectedClient = this.clients[0].id;
  selectedProject = String(this.projects[0].id);

  private chart: any;
  private subs = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    google.charts.load('current', { packages: ['gantt'] });
    google.charts.setOnLoadCallback(() => this.zone.run(() => this.drawChart()));
    window.addEventListener('resize', this.redrawOnResize);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    window.removeEventListener('resize', this.redrawOnResize);
  }

  onClientChange(): void {
    const client = this.clients.find(c => c.id === this.selectedClient)!;
    this.projects = client.projetos;
    this.selectedProject = String(this.projects[0].id);
    this.drawChart();
  }

  onProjectChange(): void {
    this.drawChart();
  }

  private drawChart(): void {
    const container = document.getElementById('gantt_chart');
    if (!container || !google || !google.visualization) {
      console.warn('Gantt container ou Google Charts não disponível');
      return;
    }

    // Monta DataTable com exemplos de atividades
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'ID');
    data.addColumn('string', 'Tarefa');
    data.addColumn('string', 'Recurso');
    data.addColumn('date',   'Início');
    data.addColumn('date',   'Fim');
    data.addColumn('number', 'Duração');
    data.addColumn('number', '% Concluído');
    data.addColumn('string', 'Dependências');

    data.addRows([
      ['T01', 'Levantamento Topográfico', 'Topografia', new Date(2025, 6, 1),  new Date(2025, 6, 5),  null, 100, null],
      ['T02', 'Limpeza do Terreno',        'Obra',       new Date(2025, 6, 6),  new Date(2025, 6, 8),  null,   0, 'T01'],
      ['T03', 'Marcação de Eixos',         'Obra',       new Date(2025, 6, 9),  new Date(2025, 6, 10), null,   0, 'T02']
    ]);

    const options = {
      height: data.getNumberOfRows() * 40 + 80,
      gantt: {
        trackHeight: 30,
        criticalPathEnabled: true,
        arrow: { angle: 100, width: 2, color: '#CB8642', radius: 0 },
        labelStyle: { fontName: 'Roboto', fontSize: 12, color: '#333' }
      }
    };

    if (!this.chart) {
      this.chart = new google.visualization.Gantt(container);
    }
    try {
      this.chart.draw(data, options);
    } catch (err) {
      console.error('Erro ao desenhar Gantt:', err);
    }
  }

  private redrawOnResize = (): void => {
    this.zone.run(() => this.drawChart());
  };

  onVoltarClick(): void {
    this.router.navigate([this.authService.getHomeRouteForRole()]);
  }
}
