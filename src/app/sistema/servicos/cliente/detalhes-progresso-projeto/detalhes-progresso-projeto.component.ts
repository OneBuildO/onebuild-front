import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalheProjetoDTO } from 'src/app/sistema/servicos/cadastro-projeto/detalhe-projeto-dto';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { NovidadesService } from 'src/app/services/services/novidades.service';
import { RespostasNovidadeService } from 'src/app/services/services/respostas-novidade.service';
import { AuthService } from 'src/app/services/services/auth.service';
import { Permissao } from 'src/app/login/permissao';
import { RespostaNovidadeRequestDTO } from 'src/app/pages/novidades/models/RespostaNovidadeRequestDTO';

@Component({
  selector: 'app-detalhes-progresso-projeto',
  templateUrl: './detalhes-progresso-projeto.component.html',
  styleUrls: ['./detalhes-progresso-projeto.component.css'],
})
export class DetalhesProgressoProjetoComponent implements OnInit {
  projetoId!: number;
  detalheProjeto?: DetalheProjetoDTO;
  novidadesList: any[] = [];
  carregando = true;
  showComentarioModal = false;
  comentarioTitulo = '';
  comentarioDescricao = '';
  comentarioTargetIndex: number | null = null;
  nomeUsuario = '';
  clienteId = '';

  // Mock para progresso
  etapas = [
    {
      label: 'Pré Início da Obra',
      descricao: 'Planejamento, aprovação do projeto e preparação do terreno.',
      img: 'assets/imagens/pre_inicio.png',
    },
    {
      label: 'Início da Obra',
      descricao:
        'Execução das fundações, estrutura inicial e instalações básicas.',
      img: 'assets/imagens/inicio_obra.png',
    },
    {
      label: 'Obra em Andamento',
      descricao:
        'Avanço das etapas construtivas como alvenaria, elétrica e hidráulica.',
      img: 'assets/imagens/obra_andamento.png',
    },
    {
      label: 'Finalização da Obra',
      descricao:
        'Acabamentos, pintura, instalação de mobiliário e revisão final.',
      img: 'assets/imagens/finalizacao_da_obra.png',
    },
    {
      label: 'Obra Finalizada',
      descricao:
        'Entrega do projeto concluído ao cliente e encerramento do contrato.',
      img: 'assets/imagens/obra_finalizada.png',
    },
  ];

  etapaAtual = 2;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projetoService: ProjetoService,
    private novidadesService: NovidadesService,
    private respostasService: RespostasNovidadeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.projetoId = Number(this.route.snapshot.paramMap.get('id'));
    this.authService.obterPerfilUsuario().subscribe((usuario) => {
      this.nomeUsuario = usuario.nome;
      this.clienteId = usuario.idUsuario;
    });

    if (this.projetoId) {
      this.carregarDetalhes();
    }
  }

  carregarDetalhes(): void {
    this.carregando = true;
    this.projetoService.obterDetalheProjeto(this.projetoId).subscribe({
      next: (res) => {
        this.detalheProjeto = res.response;
        this.carregarNovidadesComRespostas();
      },
      error: () => {
        this.carregando = false;
        alert('Erro ao carregar os detalhes do projeto.');
      },
    });
  }

  carregarNovidadesComRespostas(): void {
    if (!this.clienteId || !this.projetoId) return;

    this.novidadesService
      .getNovidadesPorProjetoECliente(this.projetoId, this.clienteId)
      .subscribe({
        next: (novidades) => {
          this.novidadesList = novidades.map((n) => ({
            id: n.id,
            titulo: n.titulo,
            descricao: n.descricao,
            status: n.statusDaObra,
            imagemUrl: n.imagemUrl,
            nomeArquitetoObra: n.nomeArquitetoObra,
            data: new Date(n.dataCadastro),
            comments: [],
          }));

          this.novidadesList.forEach((nov, idx) => {
            this.respostasService
              .getRespostasPorNovidadeECliente(nov.id, this.clienteId)
              .subscribe({
                next: (respostas) => {
                  this.novidadesList[idx].comments = respostas.map((r) => ({
                    autor: r.nomeCliente,
                    descricao: r.descricao,
                    titulo: r.titulo,
                    data: new Date(r.dataCadastro),
                  }));
                },
                error: () => console.error('Erro ao buscar respostas'),
              });
          });

          this.carregando = false;
        },
        error: () => {
          alert('Erro ao carregar novidades.');
          this.carregando = false;
        },
      });
  }

  isClient(): boolean {
    return this.authService.getRoleUsuarioFromToken() === Permissao.CLIENTE;
  }

  onVoltar(): void {
    const rota = this.authService.getHomeRouteForRole();
    this.router.navigate([rota]);
  }

  openComentarioModal(index: number): void {
    this.comentarioTargetIndex = index;
    this.comentarioTitulo = '';
    this.comentarioDescricao = '';
    this.showComentarioModal = true;
  }

  fecharComentarioModal(): void {
    this.comentarioTargetIndex = null;
    this.showComentarioModal = false;
  }

  enviarComentario(): void {
    if (
      this.comentarioTargetIndex === null ||
      !this.comentarioTitulo.trim() ||
      !this.comentarioDescricao.trim()
    ) {
      alert('Preencha todos os campos do comentário.');
      return;
    }

    const novidade = this.novidadesList[this.comentarioTargetIndex];

    const dto: RespostaNovidadeRequestDTO = {
      novidadeId: novidade.id,
      titulo: this.comentarioTitulo,
      descricao: this.comentarioDescricao,
      clienteId: this.clienteId,
    };

    this.respostasService.responderNovidade(dto).subscribe({
      next: () => {
        novidade.comments.push({
          autor: this.nomeUsuario,
          titulo: this.comentarioTitulo,
          descricao: this.comentarioDescricao,
          data: new Date(),
        });
        this.fecharComentarioModal();
      },
      error: () => alert('Erro ao enviar comentário.'),
    });
  }
}
