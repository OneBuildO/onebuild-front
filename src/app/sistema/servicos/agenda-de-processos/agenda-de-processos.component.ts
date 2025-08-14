import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { Evento } from './evento';
import { EventoService } from 'src/app/services/services/evento.service';
import { ApiResponse } from 'src/app/services/services/api-response-dto';
import { TipoCompromisso } from './tipo-compromisso';
import { TipoCompromissoDescricao } from './tipo-compromisso-descricao';
import { ModalDeleteService } from 'src/app/services/services/modal-delete.service';

type ViewMode = 'week' | 'month' | 'year';

const TIPO_CORES: Record<TipoCompromisso, string> = {
  [TipoCompromisso.PESSOAL]:  '#BFDBFE', // azul claro
  [TipoCompromisso.TRABALHO]: '#FDE68A', // amarelo claro
  [TipoCompromisso.VIAGEM]:   '#C7F9CC', // verde claro
  [TipoCompromisso.SAUDE]:    '#FECACA', // vermelho claro
  [TipoCompromisso.ESTUDO]:   '#DDD6FE', // roxo claro
  [TipoCompromisso.FERIAS]:   '#FDE2E4', // pêssego claro
};


interface CalendarDay {
  date: Date;
  otherMonth: boolean;
}

interface MonthObj {
  name: string;
  index: number;
}

@Component({
  selector: 'app-agenda-de-processos',
  templateUrl: './agenda-de-processos.component.html',
  styleUrls: ['./agenda-de-processos.component.css']
})
export class AgendaDeProcessosComponent implements OnInit {
  // labels de dias e meses
  dayNames = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  meses    = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
              'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  monthObjects: MonthObj[] = [];
  yearOptions: number[]    = [];

  // estado do app
  viewMode: ViewMode = 'month';
  selectedYear!: number;
  selectedMonthFilter!: number;
  monthDays: CalendarDay[] = [];
  eventos: Evento[] = [];

  weekDays: Date[] = [];

  TipoCompromisso = TipoCompromisso; // para usar no template
  TipoCompromissoDescricao = TipoCompromissoDescricao;
  tipoCompromissoKeys = Object.keys(TipoCompromisso) as TipoCompromisso[];
  editingEvento: Evento | null = null;
  isEditMode:boolean = false; // se estamos editando um compromisso

  // modal de compromisso
  showCompModal = false;
  modalDate!: Date;
  compTitulo     = '';
  compDescricao  = '';
  compColor      = '#ffeeba';
  compTime       = '';
  compLink       = '';
  compTipoCompromisso: TipoCompromisso | null = null;

  // mini-calendar
  selectedDate = new Date();

  constructor(
    private router: Router,
    private authService: AuthService,
    private eventoService: EventoService,
    private modalDeleteService: ModalDeleteService
  ) {
    // preenche meses
    this.monthObjects = this.meses.map((m,i) => ({ name: m, index: i }));
    // preenche anos
    for (let y = 2000; y <= 2100; y++) this.yearOptions.push(y);

    // inicializa com hoje
    const today = new Date();
    this.selectedYear        = today.getFullYear();
    this.selectedMonthFilter = today.getMonth();
  }

  ngOnInit(): void {
    this.loadEventos();
    this.applyFilters();
  }


  onVoltarClick(): void {
    this.router.navigate([ this.authService.getHomeRouteForRole() ]);
  }

  // troca de visão: week, month ou year
  setView(mode: ViewMode) {
    this.viewMode = mode;
    this.applyFilters();   
  }

  // botão +
  onAddClick() {
    this.openCompromissoModal(this.selectedDate);
  }

  // Geração de dias do mês
  applyFilters(): void {
    if (this.viewMode === 'week') {
      this.generateWeekDays();
    } else {
      this.generateMonthDays();
    }
  }

  // gera os 7 dias da semana do selectedDate (domingo → sábado)
  private generateWeekDays(): void {
    this.weekDays = [];
    const d = new Date(this.selectedDate);
    // início da semana (domingo)
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());

    for (let i = 0; i < 7; i++) {
      const wd = new Date(start);
      wd.setDate(start.getDate() + i);
      this.weekDays.push(wd);
    }
  }


  generateMonthDays(): void {
    this.monthDays = [];
    const m = this.selectedMonthFilter;
    const first = new Date(this.selectedYear, m, 1);
    const last  = new Date(this.selectedYear, m+1, 0);
    const startDay = first.getDay();

    // dias do mês anterior
    for (let i=0; i<startDay; i++) {
      this.monthDays.push({
        date: new Date(this.selectedYear, m, 1 - startDay + i),
        otherMonth: true
      });
    }
    // dias do mês atual
    for (let d=1; d<=last.getDate(); d++) {
      this.monthDays.push({ date: new Date(this.selectedYear, m, d), otherMonth: false });
    }
    // pós-lacunas
    while (this.monthDays.length % 7 !== 0) {
      const prev = this.monthDays[this.monthDays.length-1].date.getDate();
      this.monthDays.push({
        date: new Date(this.selectedYear, m, prev+1),
        otherMonth: true
      });
    }
  }

  getTipoColor(tipo: TipoCompromisso | null): string {
    return tipo ? TIPO_CORES[tipo] : '#ffeeba';
  }

  onTipoChange(tipo: TipoCompromisso) {
    this.compTipoCompromisso = tipo;
    // ao trocar o tipo, setamos a cor do card para a cor do tipo
    this.compColor = this.getTipoColor(tipo);
  }

  // Modal
  openCompromissoModal(date: Date | Evento): void {
    this.isEditMode = false;
    
    if (date instanceof Date) {
      this.modalDate     = date;
      this.compTitulo    = '';
      this.compDescricao = '';
      this.compColor     = '#ffeeba';
      this.compTime      = '';
      this.compLink      = '';
      this.compTipoCompromisso = null; 
    }else{
      this.isEditMode = true;
      const ev = date;
      this.modalDate     = new Date(ev.date);
      this.compTitulo    = ev.title;
      this.compDescricao = ev.description || '';
      this.compColor     = ev.color || '#ffeeba';
      this.compTime      = ev.time || '';
      this.compLink      = ev.link || '';
      this.compTipoCompromisso = ev.tipoCompromisso || null;
      this.editingEvento = ev;
    }
    this.showCompModal = true;
  }

  confirmCompromisso(): void {
    const iso = this.modalDate.toISOString().slice(0,10);

    const evento:Evento = {
      date: iso,
      time: this.compTime,
      title: this.compTitulo,
      description: this.compDescricao,
      color: this.compColor || this.getTipoColor(this.compTipoCompromisso),
      link: this.compLink,
      tipoCompromisso: this.compTipoCompromisso || undefined
    };

    if (this.isEditMode && this.editingEvento?.id) {
      this.eventoService.atualizar(this.editingEvento.id, evento)
        .subscribe({
          next: (res: ApiResponse<Evento>) => {
            this.loadEventos(); // recarrega a lista de eventos
            this.closeCompModal();
          },
          error: err => console.error('Falha ao atualizar evento:', err)
        });
    }else{
      this.eventoService.salvar(evento)
        .subscribe({
          next: (res: ApiResponse<Evento>) => {
            // aqui res.data é o Evento criado (com id)
            this.eventos.push(res.response);
            this.applyFilters();
            this.closeCompModal();
          },
          error: err => console.error('Falha ao salvar evento:', err)
        });
    }
  }

  openModalDeletar(evento:Evento): void {
    this.modalDeleteService.openModal(
      {
        title: 'Remoção de Evento',
        description: `Tem certeza que deseja excluir o evento <strong>${evento.title}</strong>?`, 
        item: evento,
        deletarTextoBotao: 'Remover',
        size: 'md',
      },
      () => this.onDeleteEvento()
    );
  }


  onDeleteEvento(): void {
    if (!this.editingEvento?.id) return;
    this.eventoService.deletar(this.editingEvento.id).subscribe({
      next: () => {
        this.closeCompModal();
        this.loadEventos();
      },
      error: err => console.error('Erro ao deletar evento:', err)
    });
  }

  private loadEventos(): void {
    this.eventoService.listarTodos()
      .subscribe({
        next: (res: ApiResponse<Evento[]>) => {
          // desembrulha o .data vindo do seu service
          this.eventos = res.response ?? [];
          this.applyFilters();
        },
        error: err => console.error('Erro ao carregar eventos', err)
      });
  }

  closeCompModal(): void {
    this.showCompModal = false;
  }

  // filtros de eventos
  getEventosByDate(date: Date): Evento[] {
    const iso = date.toISOString().slice(0,10);
    return this.eventos.filter(e => e.date === iso);
  }

  getEventosByMonth(month: number): Evento[] {
    return this.eventos.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month;
    });
  }

  isToday(date: Date): boolean {
    const t = new Date();
    return date.getDate()===t.getDate() &&
           date.getMonth()===t.getMonth() &&
           date.getFullYear()===t.getFullYear();
  }

  onMiniDateSelected(date: Date) {
    this.selectedDate        = date;
    this.selectedYear        = date.getFullYear();
    this.selectedMonthFilter = date.getMonth();
    this.applyFilters();
  }

  // Utility para escurecer cor
  darken(col: string, amount: number): string {
    let c = col.replace('#','');
    const num = parseInt(c,16);
    let r = (num>>16)-amount, g = ((num>>8)&0xFF)-amount, b = (num&0xFF)-amount;
    r = Math.max(r,0); g = Math.max(g,0); b = Math.max(b,0);
    return '#' + ((r<<16)|(g<<8)|b).toString(16).padStart(6,'0');
  }
}
