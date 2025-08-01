import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { ClienteService } from 'src/app/services/services/cliente.service';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { ProjetoHistorico } from 'src/app/pages/projetos/models/ProjetoHistorico';
import { StatusDoProjeto } from '../../cadastro-projeto/statusDoProjeto';
import { Status } from '../../atividades/status';
import { StatusDoProjetoDescricoes } from '../../cadastro-projeto/statusDoProjetoDescricoes';

@Component({
  selector: 'app-historico-de-status',
  templateUrl: './historico-de-status.component.html',
  styleUrls: ['./historico-de-status.component.css'],
})
export class HistoricoDeStatusComponent implements OnInit {
  projetos: ProjetoHistorico[] = [];
  isLoading = false;
  errorMsg: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private projetoService: ProjetoService
  ) {}

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.isLoading = true;
    this.errorMsg = null;

    this.projetoService.obterProjetosParaTabela().subscribe({
      next: (res) => {
        this.projetos = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err.message || 'Erro ao carregar os projetos.';
        this.isLoading = false;
      },
    });
  }

  onVoltarClick(): void {
    const rota = this.authService.getHomeRouteForRole();
    this.router.navigate([rota]);
  }

  visualizarProjeto(id: number): void {
    this.router.navigate(['/usuario/detalhes-progresso-projeto/', id]);
  }

  traduzirProjeto(status: string): string {
    return StatusDoProjetoDescricoes[status as StatusDoProjeto];
  }
}
