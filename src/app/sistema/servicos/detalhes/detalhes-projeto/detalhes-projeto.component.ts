import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { ProjetoResumoDTO } from 'src/app/sistema/servicos/cadastro-projeto/projeto-resumo-dto';
import { DetalheProjetoDTO } from 'src/app/sistema/servicos/cadastro-projeto/detalhe-projeto-dto';
import { ArquivosProjetoDTO } from 'src/app/sistema/servicos/cadastro-projeto/arquivos-projetos-dto';
import { ApiResponse } from 'src/app/services/services/api-response-dto';
import { DadosService } from 'src/app/services/services/dados.service';
import { StatusDoProjetoDescricoes } from '../../cadastro-projeto/statusDoProjetoDescricoes';
import { StatusDoProjeto } from '../../cadastro-projeto/statusDoProjeto';
import { TipoFornecedorDescricoes } from 'src/app/login/tipoFornecedorDescricoes';
import { TipoFornecedor } from 'src/app/login/tipoFornecedor';
import { Permissao } from 'src/app/login/permissao';
import { AuthService } from 'src/app/services/services/auth.service';
import { Usuario } from 'src/app/login/usuario';
import { map, Observable, of } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalDeleteService } from 'src/app/services/services/modal-delete.service';
import { ModalConfirmationService } from 'src/app/services/services/modal-confirmation.service';

interface Novidade {
  titulo: string;
  descricao: string;
  status: string;
  imagemUrl?: string;
  data: Date;
  comments: { autor: string; descricao: string; data: Date }[];  // novo campo
}


@Component({
  selector: 'app-detalhes-projeto',
  templateUrl: './detalhes-projeto.component.html',
  styleUrls: ['./detalhes-projeto.component.css']
})
export class DetalhesProjetoComponent implements OnInit {
  @Input() projetoIdInput?: number;

  detalheProjeto?: DetalheProjetoDTO;
  projetoResumo?: ProjetoResumoDTO;

  arquivosNormais: ArquivosProjetoDTO[] = [];
  // plantasBaixas: ArquivosProjetoDTO[] = [];

  projetoId!: number;
  carregando: boolean = true;
  erro?: string;

  //mensagem de sucesso
  successMessage = '';
  messageTimeout: any;

  allowedToAddNovidades = false;

  // Controle do modal de novidades
  showNovidadesModal = false;
  novidadesTitulo = '';
  novidadesDescricao = '';
  novidadesStatus = '';
  novidadesImagemFile?: File;

  listaStatusObra: string[] = [
    'Planejamento',
    'Em Andamento',
    'Concluído',
    'Aguardando Materiais'
  ];

   novidadesList: {
    titulo: string;
    descricao: string;
    status: string;
    imagemUrl?: string;
    data: Date;
    comments: { autor: string; descricao: string; data: Date }[];  // novo campo
  }[] = [];

  // comentário por item
  showComentarioModal = false;
  comentarioTitulo = '';
  comentarioDescricao = '';
  comentarioTargetIndex: number | null = null;


  rotaOrigem: 'visualizar-projeto' | 'apresentacao-do-projeto' = 'visualizar-projeto';

  //visualização dos arquivos
  previewUrls = new Map<number, SafeResourceUrl>();


  constructor(
    private projetoService: ProjetoService,
    private route: ActivatedRoute,
    private dadosService: DadosService,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private modalDeleteService: ModalDeleteService,
    private modalConfirmationService: ModalConfirmationService
  ) {}

  ngOnInit(): void {
    const url = this.router.url;
    if (url.startsWith('/usuario/apresentacao-do-projeto/')) {
      this.rotaOrigem = 'apresentacao-do-projeto';
    } else if (url.startsWith('/usuario/visualizar-projeto/')) {
      this.rotaOrigem = 'visualizar-projeto';
    }

    this.projetoId = this.projetoIdInput ?? Number(this.route.snapshot.paramMap.get('id'));
    if (this.projetoId) {
      this.carregarDetalhes();
    }
      this.authService.obterPerfilUsuario().subscribe(
      usuario => {
        const papel = usuario.tipoUsuario.toUpperCase();
        this.allowedToAddNovidades =
          papel === 'ADMIN' ||
          papel === 'ARQUITETO';
      },
      err => {
        console.error('Não foi possível obter perfil:', err);
      }
    );
  }

  carregarDetalhes(): void {
    this.carregando = true;
    this.projetoService.obterDetalheProjeto(this.projetoId).subscribe({
      next: (res: ApiResponse<DetalheProjetoDTO>) => {
        this.detalheProjeto = res.response;
        this.carregarProjetoResumo();
        this.carregarArquivosProjeto();
        this.carregando = false;
      },
      error: () => {
        this.erro = "Erro ao carregar os detalhes do projeto.";
        this.carregando = false;
      }
    });
  }

  carregarProjetoResumo(): void {
    this.projetoService.obterProjeto(this.projetoId).subscribe({
      next: (res: ApiResponse<ProjetoResumoDTO>) => {
        this.projetoResumo = res.response;
        this.carregando = false;
      },
      error: () => {
        this.erro = "Erro ao carregar informações do projeto.";
        this.carregando = false;
      }
    });
  }

  carregarArquivosProjeto(): void {
    this.dadosService.listarArquivosNormais(this.projetoId).subscribe({
      next: (res) => {
        this.arquivosNormais = res.response || [];
        console.log('Arquivos normais carregados:', this.arquivosNormais);
      },
      error: () => {
        this.erro = "Erro ao carregar arquivos.";
      }
    });

  }

  baixarArquivo(id: number, nomeArquivo: string): void {
    this.dadosService.downloadArquivo(id).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomeArquivo;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Erro ao baixar o arquivo.')
    });
  }

  baixarPlantaBaixa(id: number, nomeArquivo: string): void {
    this.dadosService.downloadPlantaBaixa(id).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomeArquivo;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Erro ao baixar a planta baixa.')
    });
  }
  //----ERA USADO PARA COLOCAR O ICON DE ACORDO COM O TIPO DO ARQUIVO----
  // getFileType(nome: string): string {
  //   return nome.split('.').pop()?.toLowerCase() || '';
  // }

  // getFileIcon(nome: string): string {
  //   const ext = this.getFileType(nome);
  //   if (ext === 'pdf') return 'assets/icones/pdf-icon.svg';
  //   if (['jpg','jpeg','png','gif'].includes(ext)) return 'assets/icones/image-icon.svg';
  //   return 'assets/icones/file-icon.svg';
  // }

  traduzirVisibilidade(statusVisibilidade: boolean): string {
    return statusVisibilidade ? "Público" : "Privado";
  }

  traduzirStatusProjeto(statusProjeto: string): string {
    return StatusDoProjetoDescricoes[statusProjeto as StatusDoProjeto];
  }

  traduzirCategoriaProjeto(categoriaProjeto: string): string {
    return TipoFornecedorDescricoes[categoriaProjeto as TipoFornecedor];
  }

  onVoltar(): void {
    this.router.navigate([`/usuario/${this.rotaOrigem}`]);
  }

  isClient(): boolean {
    return this.authService.getRoleUsuarioFromToken() === Permissao.CLIENTE;
  }

  // --- Ações dos novos botões ---
  onAdicionarNovidades(): void {
    console.log('Adicionar novidades clicado');
    // TODO: implementar lógica para "Adicionar Novidades"
  }


  openNovidadesModal(): void {
    this.showNovidadesModal = true;
  }

  fecharNovidadesModal(): void {
    this.showNovidadesModal = false;
    this.novidadesTitulo = '';
    this.novidadesDescricao = '';
    this.novidadesStatus = '';
    this.novidadesImagemFile = undefined;
  }

  onImagemChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.novidadesImagemFile = input.files[0];
    }
  }


  // ao criar novidades:
  enviarNovidades(): void {
    const nova: Novidade = {
      titulo: this.novidadesTitulo,
      descricao: this.novidadesDescricao,
      status: this.novidadesStatus,
      imagemUrl: this.novidadesImagemFile ? URL.createObjectURL(this.novidadesImagemFile) : undefined,
      data: new Date(),
      comments: []   // inicia sem comentários
    };
    this.novidadesList.unshift(nova);
    this.fecharNovidadesModal();
  }

  // ao enviar comentário:
  enviarComentario(): void {
    if (this.comentarioTargetIndex == null) return;
    const alvo = this.novidadesList[this.comentarioTargetIndex];
    const autor = this.isClient() ? 'Cliente' : 'Arquiteto';
    alvo.comments.unshift({
      autor,
      descricao: this.comentarioDescricao,
      data: new Date()
    });
    this.fecharComentarioModal();
  }

  // abre modal de comentário para um item específico
  openComentarioModal(idx: number): void {
    this.comentarioTargetIndex = idx;
    this.comentarioTitulo = '';
    this.comentarioDescricao = '';
    this.showComentarioModal = true;
  }


  fecharComentarioModal(): void {
    this.showComentarioModal = false;
    this.comentarioTargetIndex = null;
  }

  openModalDeletar(arquivo: ArquivosProjetoDTO): void {
    this.modalDeleteService.openModal(
      {
        title: 'Exclusão de Arquivo',
        description: `Tem certeza que deseja excluir o arquivo <strong>${arquivo.nomeArquivo}</strong>?`,
        item: arquivo,
        deletarTextoBotao: 'Excluir',
        size: 'md',
      },
      () => this.deleteProjeto(arquivo.id!)
    );
  }
  
  deleteProjeto(id: number): void {
    this.dadosService.excluirArquivo(id).subscribe({
      next: () => {
        this.showMessage('success', 'Arquivo apagado com sucesso.');
        this.arquivosNormais = this.arquivosNormais.filter(a => a.id !== id); //apaga o arquivo da lista
        this.previewUrls.delete(id); // remove do cache de pré-visualização
      },
      error: err => {
        console.error('Erro ao deletar o arquivo:', err);
        alert('Erro ao remover o arquivo.');
      }
    });
  }

  /** Chama o modal de confirmação antes de visualizar */
  openModalVisualizar(arquivo: ArquivosProjetoDTO) {
  this.modalConfirmationService.open(
    {
      title: 'Visualizar Arquivo',
      description: `Deseja visualizar <strong>${arquivo.nomeArquivo}</strong>?`,
      iconSrc: 'assets/icones/See.png',
      confirmButtonText: 'Visualizar',
      confirmButtonClass: 'btn-acao confirmar'
    },
    () => this.visualizarArquivo(arquivo)
  );
  }

  /** Chama o modal de confirmação antes de baixar */
  openModalDownload(arquivo: ArquivosProjetoDTO) {
    this.modalConfirmationService.open(
      {
        title: 'Download do Arquivo',
        description: `Deseja realizar o download do arquivo <strong>${arquivo.nomeArquivo}</strong>?`,
        iconSrc: 'assets/icones/download-icon.svg',
        confirmButtonText: 'Visualizar',
        confirmButtonClass: 'btn-acao confirmar'
      },
      () => this.baixarArquivo(arquivo.id, arquivo.nomeArquivo)
    );
  }

  private showMessage(type: 'success' | 'error', msg: string): void {
    this.clearMessage();
    if (type === 'success') {
      this.successMessage = msg;
      this.messageTimeout = setTimeout(() => this.clearMessage(), 4000);
    }
  }

  clearMessage(): void {
    this.successMessage = '';
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
      this.messageTimeout = null;
    }
  }

  // helper para saber extensão/MIME
  isImage(arquivo: ArquivosProjetoDTO) {
    console.log('Verificando imagem:', arquivo.nomeArquivo);
    return arquivo.nomeArquivo.match(/\.(jpe?g|png)$/i);
  }
  isPdf(arquivo: ArquivosProjetoDTO) {
    console.log('Verificando PDF:', arquivo.nomeArquivo);
    return arquivo.nomeArquivo.match(/\.pdf$/i);
  }
  isDoc(arquivo: ArquivosProjetoDTO) {
    console.log('Verificando DOC/DOCX:', arquivo.nomeArquivo);
    return arquivo.nomeArquivo.match(/\.(docx?|DOCX?)$/i);
  }


  // obtém (e cacheia) a URL de preview
  getPreviewUrl(arquivo: ArquivosProjetoDTO): Observable<SafeResourceUrl> {
    // se já tivermos gerado, retorna imediatamente
    if (this.previewUrls.has(arquivo.id)) {
      return of(this.previewUrls.get(arquivo.id)!);
    }
    return this.dadosService.downloadArquivo(arquivo.id).pipe(
      map(blob => {
        const url = URL.createObjectURL(blob);
        // converte pra um URL “trusted” que o Angular vai aceitar
        const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.previewUrls.set(arquivo.id, safeUrl);
        return safeUrl;
      })
    );
  }

  /* Abre o arquivo em nova aba para visualização */
  visualizarArquivo(arquivo: ArquivosProjetoDTO): void {
    this.dadosService.downloadArquivo(arquivo.id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        // opcional: revogar depois de algum tempo
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      },
      error: () => {
        alert('Erro ao carregar pré-visualização.');
      }
    });
  }


}
