import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';

interface Evento {
  date: string;   // ISO date e.g. '2025-07-15'
  title: string;
  description: string;
  color: string;
}

interface CalendarDay {
  date: Date;
  otherMonth: boolean;
}

interface MonthObj {
  name: string;
  index: number;
}

interface Evento {
  date: string;
  time?: string;
  title: string;
  description: string;
  color: string;
  link?: string;
  // mentions?: string;
}


@Component({
  selector: 'app-agenda-de-processos',
  templateUrl: './agenda-de-processos.component.html',
  styleUrls: ['./agenda-de-processos.component.css']
})
export class AgendaDeProcessosComponent implements OnInit {
  dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  monthObjects: MonthObj[] = [];
  yearOptions: number[] = [];

  selectedYear!: number;
  selectedMonthFilter!: number;   
  filteredMonths: MonthObj[] = [];
  monthDays: CalendarDay[] = [];
  eventos: Evento[] = [];

  showCompModal = false;
  modalDate!: Date;
  compTitulo = '';
  compDescricao = '';
  compColor = '#ffeeba';

  compTime:  string = '';
  compLink:  string = '';

  showMiniCalendar = false;
  selectedDate = new Date();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // popula objetos de mês e anos
    this.monthObjects = this.meses.map((m, i) => ({ name: m, index: i }));
    for (let y = 2000; y <= 2100; y++) {
      this.yearOptions.push(y);
    }
    // inicializa com data de hoje
    const today = new Date();
    this.selectedYear = today.getFullYear();
    this.selectedMonthFilter = today.getMonth();
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  onVoltarClick(): void {
    this.router.navigate([ this.authService.getHomeRouteForRole() ]);
  }

  applyFilters(): void {
    // filtra só o mês selecionado e gera dias
    this.filteredMonths = this.monthObjects.filter(m => m.index === this.selectedMonthFilter);
    this.generateMonthDays();
  }

  generateMonthDays(): void {
    this.monthDays = [];
    const m = this.selectedMonthFilter;
    const first = new Date(this.selectedYear, m, 1);
    const last  = new Date(this.selectedYear, m + 1, 0);
    const startDay = first.getDay();

    // pré-lacunas (dias do mês anterior)
    for (let i = 0; i < startDay; i++) {
      this.monthDays.push({
        date: new Date(this.selectedYear, m, 1 - startDay + i),
        otherMonth: true
      });
    }
    // dias do mês atual
    for (let d = 1; d <= last.getDate(); d++) {
      this.monthDays.push({
        date: new Date(this.selectedYear, m, d),
        otherMonth: false
      });
    }
    // pós-lacunas (dias do próximo mês)
    while (this.monthDays.length % 7 !== 0) {
      const prev = this.monthDays[this.monthDays.length - 1].date;
      this.monthDays.push({
        date: new Date(this.selectedYear, m, prev.getDate() + 1),
        otherMonth: true
      });
    }
  }

   openCompromissoModal(date: Date): void {
    this.modalDate     = date;
    this.compTitulo    = '';
    this.compDescricao = '';
    this.compColor     = '#ffeeba';
    this.compTime      = '';
    this.compLink      = '';
    // this.compMentions = '';
    this.showCompModal = true;
  }

  confirmCompromisso(): void {
    const iso = this.modalDate.toISOString().substring(0, 10);
    this.eventos.push({
      date:        iso,
      time:        this.compTime,
      title:       this.compTitulo,
      description: this.compDescricao,
      color:       this.compColor,
      link:        this.compLink,
      // mentions:    this.compMentions
    });
    this.closeCompModal();
  }

  closeCompModal(): void {
    this.showCompModal = false;
  }


  getEventosByDate(date: Date): Evento[] {
    const iso = date.toISOString().substring(0, 10);
    return this.eventos.filter(e => e.date === iso);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate()
        && date.getMonth() === today.getMonth()
        && date.getFullYear() === today.getFullYear();
  }

  onMiniDateSelected(date: Date) {
    // Quando o usuário escolhe uma data no mini-calendário,
    // você pode navegar direto pra esse mês e opcionalmente abrir o modal:
    this.selectedYear  = date.getFullYear();
    this.selectedMonthFilter = date.getMonth();
    this.applyFilters();
    this.openCompromissoModal(date);
  }
}
