// src/app/sistema/servicos/cliente/apresentacao-projeto/apresentacao-projeto.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { ProjetosDisponiveisDTO } from 'src/app/sistema/servicos/cadastro-projeto/projetos-disponiveis-dto';
import { DetalheProjetoDTO } from 'src/app/sistema/servicos/cadastro-projeto/detalhe-projeto-dto';

@Component({
  selector: 'app-apresentacao-projeto',
  templateUrl: './apresentacao-projeto.component.html',
  styleUrls: ['./apresentacao-projeto.component.css']
})
export class ApresentacaoProjetoComponent implements OnInit {
  projetos: ProjetosDisponiveisDTO[] = [];
  detalhe: DetalheProjetoDTO | null = null;
  isLoading = true;
  errorMsg: string | null = null;

  constructor(
    private router: Router,
    private projetoService: ProjetoService
  ) {}

 ngOnInit(): void {
  this.projetoService.getMeusProjetos().subscribe({
  next: resp => {
    // loga a resposta inteira
    console.log('getMeusProjetos resp completa:', resp);

    // loga o array
    console.log('getMeusProjetos array resp.response:', resp.response);

    // loga o primeiro elemento como string JSON indented
    console.log(
      'Exemplo de projeto[0] detalhado:\n',
      JSON.stringify(resp.response[0], null, 2)
    );

    // ou use table para visualizar colunas
    console.table(resp.response);

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


  selectProjeto(id: number) {
  this.isLoading = true;
  this.projetoService.obterDetalheProjeto(id).subscribe({
    next: resp => {
      console.log('obterDetalheProjeto resp completa:', resp);
      console.log('obterDetalheProjeto DTO:', resp.response);
      this.detalhe = resp.response;
      this.isLoading = false;
    },
    error: err => {
      console.error('Erro ao carregar detalhe:', err);
      this.errorMsg = 'Não foi possível carregar o projeto.';
      this.isLoading = false;
    }
  });
}


  onVoltarClick() {
    this.router.navigate(['/dashboard']);
  }

  download(docUrl: string) {
    window.open(docUrl, '_blank');
  }
}
