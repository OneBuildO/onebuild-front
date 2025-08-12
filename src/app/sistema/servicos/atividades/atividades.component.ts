import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { Subscription, filter, forkJoin } from 'rxjs';

import { AuthService } from 'src/app/services/services/auth.service';
import { AtividadeService } from 'src/app/services/services/atividade.service';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { ClienteService } from 'src/app/services/services/cliente.service';

import { ProjetoUsuarioDTO } from 'src/app/sistema/servicos/cadastro-projeto/projeto-usuario-dto';
import { ProjetosDisponiveisDTO } from 'src/app/sistema/servicos/cadastro-projeto/projetos-disponiveis-dto';

import { Atividade } from './atividade';
import { Status } from './status';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Prioridade } from './prioridade';
import { PrioridadeDescricao } from './PrioridadeDescricao';
import { StatusDescricao } from './StatusDescricao';

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
  clients: ProjetoUsuarioDTO[] = [];//listas usadas para filtrar as atividades e clientes
  allProjects: ProjetosDisponiveisDTO[] = [];//listas usadas para filtrar as atividades e clientes
  projects: ProjetosDisponiveisDTO[] = []; //listas usadas para filtrar as atividades e clientes
  selectedClient: ProjetoUsuarioDTO | null = null;
  selectedProject: ProjetosDisponiveisDTO | null = null;


  // ── listas para o form de cadastro da atividade ──
  formClients: ProjetoUsuarioDTO[] = [];
  formAllProjects: ProjetosDisponiveisDTO[] = [];
  formProjects: ProjetosDisponiveisDTO[] = [];
  formSelectedCliente: ProjetoUsuarioDTO | null = null;
  formSelectedProject: ProjetosDisponiveisDTO | null = null;

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
  
  Prioridade = Prioridade;
  Status = Status;
  showModalCadastro:boolean = false;
  
  submited: boolean = false;

  readonly PrioridadeDescricao = PrioridadeDescricao
  readonly StatusDescricao = StatusDescricao

  private subs = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private atividadeService: AtividadeService,
    private projetoService: ProjetoService,
    private clienteService: ClienteService,
    private form:FormBuilder
  ) {}

  ngOnInit(): void {
    this.dropListIds = this.statuses.slice();

    // carrega clientes e projetos em paralelo
    this.subs.add(
      forkJoin({
        clientes: this.projetoService.obterClientes(),
        projetos: this.projetoService.obterProjetos(),
      }).subscribe(({ clientes, projetos }) => {
        this.clients = clientes.response ?? [];
        this.allProjects = projetos.response ?? [];
        // para o form de cadastro
        this.formClients       = [...this.clients];
        this.formAllProjects   = [...this.allProjects];
      })
    );

    this.atividadeForm.get('cliente')!
      .valueChanges
      .subscribe(cliente => {
        if (!cliente) {
          // limpa projeto se quiser
          this.atividadeForm.get('projeto')!.setValue(null);
          return;
        }

        // só chega aqui quando cliente !== null
        this.formProjects = this.formAllProjects
          .filter(p => p.cliente === cliente.nome);

          // opcional: zera o projeto anterior, para forçar nova escolha
        this.atividadeForm.get('projeto')!.setValue(null);
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onFormClienteChange(clienteNome: string) {
    this.formProjects = this.formAllProjects
      .filter(p => p.cliente === clienteNome);
    
    // if (this.formProjects.length) {
    //   this.formSelectedProject = this.formProjects[0];
    // }
  }

  onClientChange(): void {
    this.filterProjects();
    // 2) Zera a seleção de projeto
    this.selectedProject = null;

    // 3) Reseta o Kanban limpando todas as colunas
    this.statuses.forEach(status => {
      this.atividades[status] = [];
    });
  }

  onProjectChange(): void {
    this.loadAtividades();
  }

  private filterProjects(): void {
    this.projects = this.allProjects.filter(
      p => p.cliente === this.selectedClient!.nome
    );
  }

  private loadAtividades(): void {
    if (!this.selectedProject) return;
    this.atividadeService
      .getAtividadesByProjetoECliente(this.selectedProject.idProjeto, this.selectedClient!.id)
      .subscribe(
        ativs => {
          console.log("Deu certo!",ativs);
          console.log("Atividades:", this.atividades)
          this.statuses.forEach(s => (this.atividades[s] = []));
          ativs.forEach(a => {
            const coluna = this.mapStatusToColuna(a.status!);
            this.atividades[coluna].push(a);
          });
        },
        err => console.error(err)
      );
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

  getPriorityClass(prioridade : Prioridade): string {
    switch (prioridade) {
      case Prioridade.ALTA:
        return 'priority-high';
      case Prioridade.MEDIA:
        return 'priority-medium';
      case Prioridade.BAIXA:
        return 'priority-low';
      default:
        return '';
    }
  }
  
  atividadeForm = this.form.group({
    nome : new FormControl('', {validators: Validators.required}),
    descricao : new FormControl('', {validators: Validators.required}),
    cliente: new FormControl<ProjetoUsuarioDTO|null>(null, Validators.required),
    projeto: new FormControl<ProjetosDisponiveisDTO|null>(null, Validators.required),
    dataDeInicio : new FormControl('', {validators: Validators.required}),
    dataDeEntrega : new FormControl('', {validators: Validators.required}),
    prioridade : new FormControl(null, {validators: Validators.required}),
    status : new FormControl(null, {validators: Validators.required}),
  });

  openModal(): void {
    this.atividadeForm.reset({
      nome: '',
      descricao: '',
      cliente: null,
      projeto:null,
      dataDeInicio : '',
      dataDeEntrega : '',
      prioridade: null,
      status: null,
    });
    this.showModalCadastro = true;
  }

  closeModal(): void {
    this.showModalCadastro = false;
    //this.novaAtividade = {};
  }


  onSubmitAtividade(){
    this.submited = true;

    if (this.atividadeForm.invalid) {
      this.atividadeForm.markAllAsTouched();
      return;
    }

    const atividade : Atividade = {
      nome: this.atividadeForm.value.nome!, 
      descricao: this.atividadeForm.value.descricao!,
      clienteId: Number(this.atividadeForm.value.cliente!.id!),
      projetoId: this.atividadeForm.value.projeto?.idProjeto!,
      dataDeInicio: this.atividadeForm.value.dataDeInicio!,
      dataDeEntrega: this.atividadeForm.value.dataDeEntrega!,
      status: this.atividadeForm.value.status!,
      prioridade: this.atividadeForm.value.prioridade!,
    }

    this.atividadeService.cadastrarAtividade(atividade).subscribe({
      next: () => {
        this.submited = false;
        this.atividadeForm.reset();
        this.closeModal();
        this.loadAtividades();
      },
      error: (err) => {
        console.error('Erro ao cadastrar atividade:', err);
      }
    });
  }
}
