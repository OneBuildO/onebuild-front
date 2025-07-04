import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';

interface CalendarDay {
  date: Date;
  otherMonth: boolean;
}

@Component({
  selector: 'app-agenda-de-processos',
  templateUrl: './agenda-de-processos.component.html',
  styleUrls: ['./agenda-de-processos.component.css']
})
export class AgendaDeProcessosComponent implements OnInit {
  dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  meses = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
  ];
  yearOptions: number[] = [];
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  calendarDays: CalendarDay[] = [];

  showCompModal = false;
  selectedDate!: Date;
  compTitulo = '';
  compDescricao = '';

  compromissos: { date: Date; title: string; description: string }[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // gera opções de anos de 2000 até 2100
    for (let y = 2000; y <= 2100; y++) this.yearOptions.push(y);
  }

  ngOnInit(): void {
    this.generateCalendar();
  }

  onVoltarClick() {
    const rota = this.authService.getHomeRouteForRole();
    this.router.navigate([rota]);
  }

  generateCalendar() {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const startWeek = firstDay.getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    // dias do mês anterior
    for (let i = startWeek - 1; i >= 0; i--) {
      const date = new Date(this.currentYear, this.currentMonth, -i);
      this.calendarDays.push({ date, otherMonth: true });
    }
    // dias do mês atual
    for (let d = 1; d <= daysInMonth; d++) {
      this.calendarDays.push({ date: new Date(this.currentYear, this.currentMonth, d), otherMonth: false });
    }
    // completar semana final
    while (this.calendarDays.length % 7 !== 0) {
      const nextDate = new Date(this.currentYear, this.currentMonth, daysInMonth + (this.calendarDays.length % 7));
      this.calendarDays.push({ date: nextDate, otherMonth: true });
    }
  }

  // navegação
  prevYear() {
    this.currentYear--;
    this.generateCalendar();
  }

  nextYear() {
    this.currentYear++;
    this.generateCalendar();
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  openCompromissoModal(date: Date) {
    this.selectedDate = date;
    this.compTitulo = '';
    this.compDescricao = '';
    this.showCompModal = true;
  }

  closeCompModal() {
    this.showCompModal = false;
  }

  saveCompromisso() {
    this.compromissos.push({ date: this.selectedDate, title: this.compTitulo, description: this.compDescricao });
    this.closeCompModal();
    // TODO: persistir via serviço
  }
}