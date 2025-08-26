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
import { map, Observable, of } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalDeleteService } from 'src/app/services/services/modal-delete.service';
import { ModalConfirmationService } from 'src/app/services/services/modal-confirmation.service';
import { NovidadesService } from 'src/app/services/services/novidades.service';
import { RespostasNovidadeService } from 'src/app/services/services/respostas-novidade.service';
import { ProjetoNovidadeRequestDTO } from 'src/app/pages/novidades/models/ProjetoNovidadeRequestDTO';
import { RespostaNovidadeRequestDTO } from 'src/app/pages/novidades/models/RespostaNovidadeRequestDTO';

@Component({
  selector: 'app-detalhes-projeto',
  templateUrl: './detalhes-projeto.component.html',
  styleUrls: ['./detalhes-projeto.component.css'],
})
export class DetalhesProjetoComponent implements OnInit {
  @Input() projetoIdInput?: number;

  detalheProjeto?: DetalheProjetoDTO;
  projetoResumo?: ProjetoResumoDTO;

  arquivosNormais: ArquivosProjetoDTO[] = [];
  // plantasBaixas: ArquivosProjetoDTO[] = [];

  propostasDoProjeto: any[] = [];

  nomeUsuario!: string;
  projetoId!: number;
  clienteid!: string | undefined;
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

  listaStatusObra = [
    { value: 'PLANEJAMENTO', label: 'Planejamento' },
    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
    { value: 'CONCLUIDO', label: 'Concluído' },
    { value: 'AGUARDANDO_MATERIAIS', label: 'Aguardando Materiais' },
  ];

  novidadesList: {
    id: string;
    titulo: string;
    descricao: string;
    status: string;
    imagemUrl?: string;
    nomeArquitetoObra: string;
    data: Date;
    comments: {
      autor: string;
      titulo: string;
      descricao: string;
      data: Date;
    }[]; // novo campo
  }[] = [];

  // comentário por item
  showComentarioModal = false;
  comentarioTitulo = '';
  comentarioDescricao = '';
  comentarioTargetIndex: number | null = null;

  rotaOrigem: 'visualizar-projeto' | 'apresentacao-do-projeto' =
    'visualizar-projeto';

  //visualização dos arquivos
  previewUrls = new Map<number, SafeResourceUrl>();
  apiURL: string = "http://localhost:8083";

  constructor(
    private projetoService: ProjetoService,
    private route: ActivatedRoute,
    private dadosService: DadosService,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private modalDeleteService: ModalDeleteService,
    private modalConfirmationService: ModalConfirmationService,
    private novidadesService: NovidadesService,
    private respostasService: RespostasNovidadeService
  ) {}

  ngOnInit(): void {
    const url = this.router.url;
    if (url.startsWith('/usuario/apresentacao-do-projeto/')) {
      this.rotaOrigem = 'apresentacao-do-projeto';
    } else if (url.startsWith('/usuario/visualizar-projeto/')) {
      this.rotaOrigem = 'visualizar-projeto';
    }

    this.projetoId =
      this.projetoIdInput ?? Number(this.route.snapshot.paramMap.get('id'));
    if (this.projetoId) {
      this.carregarDetalhes();
    }
    this.authService.obterPerfilUsuario().subscribe(
      (usuario) => {
        const papel = usuario.tipoUsuario.toUpperCase();
        this.nomeUsuario = usuario.nome;
        this.allowedToAddNovidades = papel === 'ADMIN' || papel === 'ARQUITETO';
      },
      (err) => {
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
        this.erro = 'Erro ao carregar os detalhes do projeto.';
        this.carregando = false;
      },
    });
  }

  carregarProjetoResumo(): void {
    this.projetoService.obterProjeto(this.projetoId).subscribe({
      next: (res: ApiResponse<ProjetoResumoDTO>) => {
        this.projetoResumo = res.response;
        this.carregando = false;
        this.carregarNovidadesComRespostas();
      },
      error: () => {
        this.erro = 'Erro ao carregar informações do projeto.';
        this.carregando = false;
      },
    });
  }

  carregarArquivosProjeto(): void {
    this.dadosService.listarArquivosNormais(this.projetoId).subscribe({
      next: (res) => {
        this.arquivosNormais = res.response || [];
        console.log('Arquivos normais carregados:', this.arquivosNormais);
      },
      error: () => {
        this.erro = 'Erro ao carregar arquivos.';
      },
    });
  }

  baixarArquivo(id: number, nomeArquivo: string): void {
    this.dadosService.downloadArquivo(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomeArquivo;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Erro ao baixar o arquivo.'),
    });
  }

  baixarPlantaBaixa(id: number, nomeArquivo: string): void {
    this.dadosService.downloadPlantaBaixa(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomeArquivo;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Erro ao baixar a planta baixa.'),
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
    return statusVisibilidade ? 'Público' : 'Privado';
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

  isArquiteto():boolean{
    return this.authService.getRoleUsuarioFromToken() === Permissao.ARQUITETO;
  }

  isAdmin():boolean{
    return this.authService.getRoleUsuarioFromToken() === Permissao.ADMIN;
  }

  onAdicionarNovidades(): void {
    if (
      !this.novidadesTitulo ||
      !this.novidadesDescricao ||
      !this.novidadesStatus
    ) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const clienteId = this.projetoResumo?.idCliente;
    if (!clienteId) {
      alert('Erro: cliente não autenticado');
      return;
    }

    const dto: ProjetoNovidadeRequestDTO = {
      clienteId,
      projetoId: this.projetoId,
      titulo: this.novidadesTitulo,
      statusDaObra: this.novidadesStatus,
      descricao: this.novidadesDescricao,
      imagem: this.novidadesImagemFile,
    };

    this.novidadesService.cadastrarNovidade(dto).subscribe({
      next: (res) => {
        // Supondo que o backend retorne a novidade criada
        this.novidadesList.push(res);
        this.fecharNovidadesModal();
        this.showMessage('success', 'Novidade adicionada com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao cadastrar novidade:', err);
        alert('Erro ao adicionar novidade.');
      },
    });
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

  enviarNovidades(): void {
    if (
      !this.novidadesTitulo ||
      !this.novidadesDescricao ||
      !this.novidadesStatus
    ) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const clienteId = this.projetoResumo?.idCliente;
    if (!clienteId) {
      alert('Erro: cliente não autenticado.');
      return;
    }

    const novidade = this.novidadesList;

    const dto: ProjetoNovidadeRequestDTO = {
      clienteId,
      projetoId: this.projetoId,
      titulo: this.novidadesTitulo,
      descricao: this.novidadesDescricao,
      statusDaObra: this.novidadesStatus,
      imagem: this.novidadesImagemFile,
    };

    this.novidadesService.cadastrarNovidade(dto).subscribe({
      next: (res) => {
        this.novidadesList.push({
        id: res.id,
        titulo: res.titulo,
        descricao: res.descricao,
        status: res.statusDaObra,
        nomeArquitetoObra: res.nomeArquitetoObra,
        imagemUrl: res.imagemId ? `${this.apiURL}/novidade/dados/${res.imagemId}` : undefined,
        data: new Date(),
        comments: []
      });

        this.fecharNovidadesModal();
        this.showMessage('success', 'Novidade adicionada com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao cadastrar novidade:', err);
        alert('Erro ao adicionar novidade.');
      },
    });
  }

  enviarComentario(): void {
    if (
      this.comentarioTargetIndex == null ||
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
      clienteId: this.projetoResumo?.idCliente ?? '',
    };

    this.respostasService.responderNovidade(dto).subscribe({
      next: () => {
        const autor = this.nomeUsuario;
        novidade.comments.push({
          autor,
          descricao: this.comentarioDescricao,
          data: new Date(),
          titulo: this.comentarioTitulo,
        });
        this.fecharComentarioModal();
        this.showMessage('success', 'Comentário enviado com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao enviar comentário:', err);
        alert('Erro ao enviar o comentário.');
      },
    });
  }

  carregarNovidadesComRespostas(): void {
    const clienteId = this.projetoResumo?.idCliente;
    if (!clienteId || !this.projetoId) return;

    this.novidadesService
      .getNovidadesPorProjetoECliente(this.projetoId, clienteId)
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

          // Para cada novidade, buscar suas respostas
          this.novidadesList.forEach((nov, idx) => {
            this.respostasService
              .getRespostasPorNovidadeECliente(nov.id, clienteId)
              .subscribe({
                next: (respostas) => {
                  this.novidadesList[idx].comments = respostas.map((r) => ({
                  autor: r.nomeCliente, 
                    descricao: r.descricao,
                    titulo: r.titulo, 
                    data: new Date(r.dataCadastro),
                  }));
                },
                error: (err) =>
                  console.error(
                    `Erro ao buscar respostas da novidade ${nov.id}:`,
                    err
                  ),
              });
          });
        },
        error: (err) => {
          console.error('Erro ao buscar novidades:', err);
        },
      });
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
        description: `Tem certeza que deseja excluir o arquivo <strong>${arquivo.key}</strong>?`,
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
        this.arquivosNormais = this.arquivosNormais.filter((a) => a.id !== id); //apaga o arquivo da lista
        this.previewUrls.delete(id); // remove do cache de pré-visualização
      },
      error: (err) => {
        console.error('Erro ao deletar o arquivo:', err);
        alert('Erro ao remover o arquivo.');
      },
    });
  }

  /** Chama o modal de confirmação antes de visualizar */
  openModalVisualizar(arquivo: ArquivosProjetoDTO) {
    this.modalConfirmationService.open(
      {
        title: 'Visualizar Arquivo',
        description: `Deseja visualizar <strong>${arquivo.key}</strong>?`,
        iconSrc: 'assets/icones/See.png',
        confirmButtonText: 'Visualizar',
        confirmButtonClass: 'btn-acao confirmar',
      },
      () => this.visualizarArquivo(arquivo)
    );
  }

  /** Chama o modal de confirmação antes de baixar */
  openModalDownload(arquivo: ArquivosProjetoDTO) {
    this.modalConfirmationService.open(
      {
        title: 'Download do Arquivo',
        description: `Deseja realizar o download do arquivo <strong>${arquivo.key}</strong>?`,
        iconSrc: 'assets/icones/download-icon.svg',
        confirmButtonText: 'Download',
        confirmButtonClass: 'btn-acao confirmar',
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
    // console.log('Verificando imagem:', arquivo.nomeArquivo);
    return arquivo.key.match(/\.(jpe?g|png)$/i);
  }

  isPdf(arquivo: ArquivosProjetoDTO) {
    // console.log('Verificando PDF:', arquivo.nomeArquivo);
    return arquivo.key.match(/\.pdf$/i);
  }

  isDoc(arquivo: ArquivosProjetoDTO) {
    // console.log('Verificando DOC/DOCX:', arquivo.nomeArquivo);
    return arquivo.key.match(/\.(docx?|DOCX?)$/i);
  }

  // obtém (e cacheia) a URL de preview
  getPreviewUrl(arquivo: ArquivosProjetoDTO): Observable<SafeResourceUrl> {
    // se já tivermos gerado, retorna imediatamente
    if (this.previewUrls.has(arquivo.id)) {
      return of(this.previewUrls.get(arquivo.id)!);
    }
    return this.dadosService.downloadArquivo(arquivo.id).pipe(
      map((blob) => {
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
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        // opcional: revogar depois de algum tempo
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      },
      error: () => {
        alert('Erro ao carregar pré-visualização.');
      },
    });
  }
}
