import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';

import { AuthService } from 'src/app/services/services/auth.service';
import { AtividadeService } from 'src/app/services/services/atividade.service';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { ClienteService } from 'src/app/services/services/cliente.service';

import { ProjetoUsuarioDTO } from 'src/app/sistema/servicos/cadastro-projeto/projeto-usuario-dto';
import { ProjetosDisponiveisDTO } from 'src/app/sistema/servicos/cadastro-projeto/projetos-disponiveis-dto';

import { Atividade } from './atividade';
import { Status } from './status';

interface Tasks {
  [coluna: string]: Atividade[];
}

@Component({
  selector: 'app-atividades',
  templateUrl: './atividades.component.html',
  styleUrls: ['./atividades.component.css'],
})
export class AtividadesComponent implements OnInit, OnDestroy {
  // filtros de cliente/projeto
  clients: ProjetoUsuarioDTO[] = [];
  allProjects: ProjetosDisponiveisDTO[] = [];
  projects: ProjetosDisponiveisDTO[] = [];
  selectedClient!: ProjetoUsuarioDTO;
  selectedProject!: ProjetosDisponiveisDTO;

  // Kanban
  statuses = ['backlog', 'emProgresso', 'revisao', 'concluido'];
  statusLabels: Record<string, string> = {
    backlog: 'A fazer',
    emProgresso: 'Em andamento',
    revisao: 'Revisão',
    concluido: 'Concluído',
  };
  statusColors: Record<string, string> = {
    backlog: '#a22bc6',
    emProgresso: '#3498db',
    revisao: '#f39c12',
    concluido: '#1D7206',
  };
  atividades: Tasks = {
    backlog: [],
    emProgresso: [],
    revisao: [],
    concluido: [],
  };
  dropListIds: string[] = [];

  private subs = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private atividadeService: AtividadeService,
    private projetoService: ProjetoService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.dropListIds = this.statuses.slice();

    // carrega clientes e projetos em paralelo
    this.subs.add(
      forkJoin({
        clientes: this.projetoService.obterClientes(),
        projetos: this.projetoService.obterProjetos(),
      }).subscribe(({ clientes, projetos }) => {
        this.clients = clientes.response;
        this.allProjects = projetos.response;

        if (this.clients.length) {
          this.selectedClient = this.clients[0];
          this.filterProjects();
        }
        if (this.projects.length) {
          this.selectedProject = this.projects[0];
        }

        this.loadAtividades();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onClientChange(): void {
    this.filterProjects();
    if (this.projects.length) {
      this.selectedProject = this.projects[0];
    }
    this.loadAtividades();
  }

  onProjectChange(): void {
    this.loadAtividades();
  }

  private filterProjects(): void {
    this.projects = this.allProjects.filter(
      p => p.cliente === this.selectedClient.nome
    );
  }

  private loadAtividades(): void {
    // endpoint que recebe idCliente e idProjeto
    this.atividadeService
      .getAtividadesByProjeto(
        this.selectedClient.id,
        this.selectedProject.idProjeto
      )
      .subscribe((ativs: Atividade[]) => {
        // limpa colunas
        this.statuses.forEach(col => (this.atividades[col] = []));
        // distribui por coluna
        ativs.forEach(a => {
          // garantir que a.status é do tipo Status
          const st = (a.status as Status) ?? Status.A_FAZER;
          const coluna = this.mapStatusToColuna(st);
          this.atividades[coluna]?.push({ ...a, status: st });
        });
      });
  }

  drop(event: CdkDragDrop<Atividade[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const atividade = event.previousContainer.data[event.previousIndex];
      const novoStatus: Status = this.mapColunaToStatus(event.container.id);

      // move visual
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      atividade.status = novoStatus;

      // persiste no back-end
      this.atividadeService
        .atualizarStatusAtividade(atividade.id!, novoStatus)
        .subscribe({
          error: () => {
            // rollback em caso de falha
            transferArrayItem(
              event.container.data,
              event.previousContainer.data,
              event.currentIndex,
              event.previousIndex
            );
            atividade.status = this.mapColunaToStatus(
              event.previousContainer.id
            );
          },
        });
    }
  }

  // mapeia do enum Status para o nome da coluna Kanban
  private statusToColunaMap: Record<Status, string> = {
    [Status.A_FAZER]: 'backlog',
    [Status.EM_PROGRESSO]: 'emProgresso',
    [Status.REVISAO]: 'revisao',
    [Status.CONCLUIDO]: 'concluido',
  };

  private mapStatusToColuna(status: Status): string {
    return this.statusToColunaMap[status] ?? 'backlog';
  }

  // mapeia do nome da coluna Kanban para o enum Status
  private colunaToStatusMap: Record<string, Status> = {
    backlog: Status.A_FAZER,
    emProgresso: Status.EM_PROGRESSO,
    revisao: Status.REVISAO,
    concluido: Status.CONCLUIDO,
  };

  private mapColunaToStatus(coluna: string): Status {
    return this.colunaToStatusMap[coluna] ?? Status.A_FAZER;
  }
}
