// atividades.component.ts
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { ClienteService } from 'src/app/services/services/cliente.service';

declare const google: any;

@Component({
  selector: 'app-atividades',
  templateUrl: './atividades.component.html',
  styleUrls: ['./atividades.component.css']
})
export class AtividadesComponent implements OnInit {
  constructor(
    private router: Router,
    private clienteService: ClienteService,
    private authService: AuthService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    // Carrega o package 'gantt' do Google Charts
    google.charts.load('current', { packages: ['gantt'] });
    // Quando estiver pronto, chama drawChart
    google.charts.setOnLoadCallback(() => this.zone.run(() => this.drawChart()));
  }

  private drawChart() {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Task ID');
    data.addColumn('string', 'Task Name');
    data.addColumn('string', 'Resource');
    data.addColumn('date',   'Start Date');
    data.addColumn('date',   'End Date');
    data.addColumn('number', 'Duration');
    data.addColumn('number', 'Percent Complete');
    data.addColumn('string', 'Dependencies');

    data.addRows([
      ['T01', 'Levantamento Topográfico', 'Topografia', new Date(2025, 6, 1),  new Date(2025, 6, 5),  null, 100, null],
      ['T02', 'Limpeza do Terreno',       'Obra',        new Date(2025, 6, 6),  new Date(2025, 6, 8),  null,   0, 'T01'],
      ['T03', 'Marcação de Eixos',        'Obra',        new Date(2025, 6, 9),  new Date(2025, 6, 10), null,   0, 'T02'],
      ['T04', 'Fundação',                 'Infra',       new Date(2025, 6, 11), new Date(2025, 6, 20), null,   0, 'T03'],
      ['T05', 'Estrutura de Concreto',    'Estrutura',   new Date(2025, 6, 21), new Date(2025, 6, 30), null,   0, 'T04'],
      ['T06', 'Alvenaria',                'Obra',        new Date(2025, 7, 1),  new Date(2025, 7, 10), null,   0, 'T05'],
      ['T07', 'Instalações Hidráulicas',  'Hidráulica',  new Date(2025, 7, 11), new Date(2025, 7, 15), null,   0, 'T06'],
      ['T08', 'Instalações Elétricas',    'Elétrica',    new Date(2025, 7, 11), new Date(2025, 7, 18), null,   0, 'T06'],
      ['T09', 'Instalações Sanitárias',    'Hidráulica',  new Date(2025, 7, 16), new Date(2025, 7, 20), null,   0, 'T07'],
      ['T10', 'Cobertura',                'Obra',        new Date(2025, 7, 19), new Date(2025, 7, 25), null,   0, 'T08'],
      ['T11', 'Esquadrias',               'Obra',        new Date(2025, 7, 26), new Date(2025, 7, 30), null,   0, 'T10'],
      ['T12', 'Revestimento Interno',     'Acabamento',  new Date(2025, 8, 1),  new Date(2025, 8, 5),  null,   0, 'T06'],
      ['T13', 'Revestimento Externo',     'Acabamento',  new Date(2025, 8, 6),  new Date(2025, 8, 10), null,   0, 'T12'],
      ['T14', 'Pintura Interna',          'Acabamento',  new Date(2025, 8, 11), new Date(2025, 8, 15), null,   0, 'T12'],
      ['T15', 'Pintura Externa',          'Acabamento',  new Date(2025, 8, 16), new Date(2025, 8, 20), null,   0, 'T13'],
      ['T16', 'Pisos e Revestimentos',    'Acabamento',  new Date(2025, 8, 21), new Date(2025, 8, 25), null,   0, 'T12'],
      ['T17', 'Vidros e Espelhos',        'Acabamento',  new Date(2025, 8, 26), new Date(2025, 8, 28), null,   0, 'T11'],
      ['T18', 'Louças e Metais',          'Hidráulica',  new Date(2025, 8, 29), new Date(2025, 8, 31), null,   0, 'T09'],
      ['T19', 'Sistema Elétrico Final',   'Elétrica',    new Date(2025, 9, 1),  new Date(2025, 9, 3),  null,   0, 'T08'],
      ['T20', 'Teste de Pressão',         'Hidráulica',  new Date(2025, 9, 4),  new Date(2025, 9, 5),  null,   0, 'T09'],
      ['T21', 'Instalação de Iluminação', 'Elétrica',    new Date(2025, 9, 6),  new Date(2025, 9, 8),  null,   0, 'T19'],
      ['T22', 'Controle de Qualidade',    'Obra',        new Date(2025, 9, 9),  new Date(2025, 9, 12), null,   0, 'T21'],
      ['T23', 'Limpeza Pós-Obra',         'Serviços',    new Date(2025, 9, 13), new Date(2025, 9, 14), null,   0, 'T22'],
      ['T24', 'Paisagismo',               'Serviços',    new Date(2025, 9, 15), new Date(2025, 9, 18), null,   0, 'T23'],
      ['T25', 'Mobiliário',               'Obra',        new Date(2025, 9, 19), new Date(2025, 9, 22), null,   0, 'T23'],
      ['T26', 'Teste de Funcionalidade',  'QA',          new Date(2025, 9, 23), new Date(2025, 9, 24), null,   0, 'T22'],
      ['T27', 'Vistoria Final',           'QA',          new Date(2025, 9, 25), new Date(2025, 9, 26), null,   0, 'T26'],
      ['T28', 'Entrega Oficial',          'Admin',       new Date(2025, 9, 27), new Date(2025, 9, 27), null,   0, 'T27'],
      ['T29', 'Documentação',             'Admin',       new Date(2025, 8, 28), new Date(2025, 8, 30), null,   0, 'T28'],
      ['T30', 'Pós-Entrega',              'Suporte',     new Date(2025, 8, 31), new Date(2025, 9, 5),  null,   0, 'T28'],
    ]);


    const options = {
      height: 300,
      gantt: {
        trackHeight: 30,
        arrow: {
          angle: 100,
          width: 2,
          color: '#CB8642',
          radius: 0
        },
        labelStyle: {
          fontName: 'Roboto',
          fontSize: 12,
          color: '#333'
        }
      }
    };

    const chart = new google.visualization.Gantt(
      document.getElementById('gantt_chart')
    );
    chart.draw(data, options);
  }

  onVoltarClick() {
    const rota = this.authService.getHomeRouteForRole();
    this.router.navigate([rota]);
  }
}
