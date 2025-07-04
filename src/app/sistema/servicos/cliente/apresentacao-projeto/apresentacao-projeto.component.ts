import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { ProjetosDisponiveisDTO } from 'src/app/sistema/servicos/cadastro-projeto/projetos-disponiveis-dto';
import { StatusDoProjetoDescricoes } from '../../cadastro-projeto/statusDoProjetoDescricoes';
import { StatusDoProjeto } from '../../cadastro-projeto/statusDoProjeto';

@Component({
  selector: 'app-apresentacao-projeto',
  templateUrl: './apresentacao-projeto.component.html',
  styleUrls: ['./apresentacao-projeto.component.css']
})
export class ApresentacaoProjetoComponent implements OnInit {
  projetos: ProjetosDisponiveisDTO[] = [];
  isLoading = true;
  errorMsg: string | null = null;

  constructor(
    private router: Router,
    private projetoService: ProjetoService
  ) {}

  ngOnInit(): void {
    this.projetoService.getMeusProjetos().subscribe({
      next: resp => {
        console.log(resp);
        this.projetos = resp.response || [];
        this.isLoading = false;
      },
      error: err => {
        console.error('Erro ao buscar seus projetos:', err);
        this.errorMsg = 'Erro ao buscar seus projetos.';
        this.isLoading = false;
      }
    });
  }

  visualizarProjeto(id: number): void {
    this.router.navigate(['/usuario/apresentacao-do-projeto', id]);
  }

  traduzirStatusDoProjeto(statusDoProjeto: string): string {
    return StatusDoProjetoDescricoes[statusDoProjeto as StatusDoProjeto];
  }

  onVoltarClick(): void {
    this.router.navigate(['/dashboard']);
  }
}