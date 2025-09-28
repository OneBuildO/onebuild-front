import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { CidadesService, listaEstados } from 'src/app/services/services/cidade.service';
import { DadosService } from 'src/app/services/services/dados.service';
import { ApiResponse } from 'src/app/services/services/api-response-dto';
import { ArquivosProjetoDTO } from 'src/app/sistema/servicos/cadastro-projeto/arquivos-projetos-dto';
import { StatusDoProjeto } from './statusDoProjeto';
import { VisibilidadeProjeto } from './visibilidade-projeto.enum';
import { StatusDoProjetoDescricoes } from './statusDoProjetoDescricoes';
import { AlertType } from 'src/app/shared/components/alert/alert.type';
import { ERROR_MESSAGES } from 'src/app/shared/components/validation-error/error-messages';
import { ProjetoResumoDTO } from './projeto-resumo-dto';
import { ProjetoUsuarioDTO } from './projeto-usuario-dto';
import { TipoFornecedor } from 'src/app/login/tipoFornecedor';
import { TipoFornecedorDescricoes } from 'src/app/login/tipoFornecedorDescricoes';
import { CategoriaProjeto } from './categoriaProjeto.enum';
import { CategoriaProjetoDescricoes } from './categoriaProjetoDescricoes';
import { ModalCadastroService } from 'src/app/services/services/modal-cadastro.service';


// modelo local
type ArquivoComCategoria = {
  file: File;
  categoria: TipoFornecedor;
};


@Component({
  selector: 'app-cadastro-projeto',
  templateUrl: './cadastro-projeto.component.html',
  styleUrls: ['./cadastro-projeto.component.css']
})
export class CadastroProjetoComponent implements OnInit {
  @ViewChild('templateConteudoModal') templateConteudoModal!: TemplateRef<any>;


  projetoForm = this.formBuilder.group({
    id: new FormControl<number | null>(null),
    cliente: new FormControl('', [Validators.required]),
    nomeProjeto: new FormControl('', [Validators.required]),
    arquivos: new FormControl<File[]>([]),
    plantaBaixa: new FormControl<File[]>([]),
    categoria: new FormControl('', [Validators.required]),
    dataLimiteOrcamento: new FormControl('', [Validators.required]),
    observacoes: new FormControl(''),
    estado: new FormControl('', [Validators.required]),
    cidade: new FormControl('', [Validators.required]),
    endereco: new FormControl('', [Validators.required]),
    visibilidade: new FormControl(VisibilidadeProjeto.PUBLICO),
    status: new FormControl(StatusDoProjeto.NOVO_PROJETO, [Validators.required]),
  });


  arquivosNovos: ArquivoComCategoria[] = [];


  arquivoModalForm = this.formBuilder.group({
    categoria: new FormControl<TipoFornecedor | null>(null, [Validators.required]),
    arquivos: new FormControl<File[]>([])
  })




  submited = false;
  submitedModal = false;
  isEditMode = false;
  projetoId: number | null = null;
  isLoading: boolean = false;

  arquivosProjeto: ArquivosProjetoDTO[] = [];
  // plantaBaixa: ArquivosProjetoDTO[] = [];

  arquivosModal: File[] = [];
  arquivosRemoverIds: number[] = [];
  plantasRemoverIds: number[] = []; //não está sendo usado, mas mantido para estrutura

  clientes: ProjetoUsuarioDTO[] = [];
  listaCidades: any[] = [];

  categoriaProjetoArr: CategoriaProjeto[] = Object
    .values(CategoriaProjeto)
    .sort((a, b) => a.localeCompare(b));

  tipoFornecedor: TipoFornecedor[] = Object.values(TipoFornecedor);

  protected readonly TipoFornecedorDescricoes = TipoFornecedorDescricoes
  protected readonly listaEstados = listaEstados;
  statusProjetoArr = Object.values(StatusDoProjeto) as StatusDoProjeto[];
  visibilidadeProjetoArr = Object.values(VisibilidadeProjeto) as VisibilidadeProjeto[];
  protected readonly StatusDoProjetoDescricoes = StatusDoProjetoDescricoes;
  protected readonly ERROR_MESSAGES = ERROR_MESSAGES;
  readonly CategoriaProjetoDescricoes = CategoriaProjetoDescricoes;

  successMessage: string | null = null;
  errorMessage: string | null = null;
  errorMessageModal: string | null = null;
  tipoAlerta = AlertType.Warning;

  private tiposPermitidos = [
    'image/png',
    'image/jpeg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private projetoService: ProjetoService,
    private cidadeService: CidadesService,
    private dadosService: DadosService,
    private modalCadastroService: ModalCadastroService
  ) { }

  ngOnInit(): void {
    this.carregarClientes();
    this.verificarModoEdicao();
  }

  private verificarModoEdicao(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.projetoId = Number(idParam);

      this.projetoService.obterProjeto(this.projetoId).subscribe({
        next: ({ response: projeto }) => {
          console.log("Ta aqui: ", projeto);
          this.projetoForm.patchValue({
            id: projeto.id,
            cliente: projeto.idCliente,
            nomeProjeto: projeto.nomeProjeto,
            categoria: projeto.categoria,
            dataLimiteOrcamento: projeto.dataLimiteOrcamento,
            observacoes: projeto.observacoes,
            estado: projeto.estado,
            cidade: projeto.cidade,
            endereco: projeto.endereco,
            visibilidade: projeto.publico
              ? VisibilidadeProjeto.PUBLICO
              : VisibilidadeProjeto.PRIVADO,
            status: projeto.status,
          });

          this.obterCidadePorEstado(projeto.estado);

          this.dadosService.listarArquivosNormais(this.projetoId!).subscribe({
            next: (res: ApiResponse<ArquivosProjetoDTO[]>) => {
              this.arquivosProjeto = res.response;
            },
            error: () => {
              this.arquivosProjeto = [];
            }
          });

          // this.dadosService.listarPlantasBaixas(this.projetoId!).subscribe({
          //   next: (res: ApiResponse<ArquivosProjetoDTO[]>) => {
          //     this.plantaBaixa = res.response;
          //   },
          //   error: () => {
          //     this.plantaBaixa = [];
          //   }
          // });
        },
        error: () => {
          this.errorMessage = 'Erro ao carregar dados do projeto para edição.';
        }
      });
    }
  }

  carregarClientes(): void {
    this.projetoService.obterClientes().subscribe({
      next: res => this.clientes = res.response,
      error: () => this.errorMessage = 'Erro ao carregar lista de clientes.'
    });
  }

  onEstadoChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const estadoSigla = selectElement.value;
    this.obterCidadePorEstado(estadoSigla);
  }

  obterCidadePorEstado(estadoSigla: string) {
    if (estadoSigla) {
      this.cidadeService.getCidadesByEstado(estadoSigla).subscribe(data => {
        this.listaCidades = data;
      });
    } else {
      this.listaCidades = [];
    }
  }

  onArquivosSelecionados(arquivos: File[]): void {
    const arquivosValidos = this.validarArquivos(arquivos);
    if (arquivosValidos.length < arquivos.length) {
      this.errorMessage = 'Alguns arquivos foram ignorados por não serem dos tipos permitidos (PNG, JPEG, PDF, DOC, DOCX).';
    }
    this.arquivoModalForm.get('arquivos')?.setValue(arquivosValidos);
  }

  abrirModalAdicionarArquivos(): void {
    this.modalCadastroService.openModal(
      {
        title: 'Adicionar Arquivos',
        confirmTextoBotao: 'Adicionar',
        cancelTextoBotao: 'Cancelar',
        size: 'md:max-w-3xl',
        description: 'Selecione os arquivos que deseja adicionar ao projeto.',

      },
      () => this.onSubmitArquivosModal(),
      this.templateConteudoModal
    );
  }

  // Função para validar os arquivos
  private validarArquivos(arquivos: File[]): File[] {
    return arquivos.filter(arquivo => this.tiposPermitidos.includes(arquivo.type));
  }

  removerArquivoExistente(id: number, tipo: 'arquivo' | 'planta'): void {
    if (tipo === 'arquivo') {
      this.arquivosRemoverIds.push(id);
      this.arquivosProjeto = this.arquivosProjeto.filter(a => a.id !== id);
    } else {
      // this.plantasRemoverIds.push(id);
    }
  }

  removerArquivoNovo(target: ArquivoComCategoria) {
    this.arquivosNovos = this.arquivosNovos.filter(a => a !== target);
  }

  get arquivosNovosAgrupados() {
    // agrupa por categoria
    const grupos = new Map<TipoFornecedor, ArquivoComCategoria[]>();
    for (const item of this.arquivosNovos) {
      const arr = grupos.get(item.categoria) || [];
      arr.push(item);
      grupos.set(item.categoria, arr);
    }

    // ordena categorias pelo rótulo (ou pela ordem do enum, se preferir)
    const categoriasOrdenadas = Array.from(grupos.keys()).sort((a, b) =>
      this.TipoFornecedorDescricoes[a].localeCompare(this.TipoFornecedorDescricoes[b])
    );

    // retorna lista amigável para o template
    return categoriasOrdenadas.map(cat => ({
      categoria: cat,
      descricao: this.TipoFornecedorDescricoes[cat],
      arquivos: grupos.get(cat)!
    }));
  }


  onSubmitArquivosModal(): boolean {
    this.submitedModal = true;
    this.arquivoModalForm.markAllAsTouched();

    if (this.arquivoModalForm.invalid) {
      this.errorMessageModal = 'Por favor, selecione uma categoria e ao menos um arquivo.';
      return false; // <- impede o fechamento do modal
    }

    const categoria = this.arquivoModalForm.get('categoria')!.value!;
    const novosArquivos = this.arquivoModalForm.get('arquivos')?.value || [];

    // adiciona cada arquivo com sua categoria
    novosArquivos.forEach(file => {
      this.arquivosNovos.push({ file, categoria });
    });

    this.arquivoModalForm.reset();
    this.submitedModal = false;
    this.errorMessageModal = null;
    return true; // <- permite o fechamento do modal
  }

  onSubmit(): void {
    this.submited = true;
    this.isLoading = true;
    this.projetoForm.markAllAsTouched();

    if (this.projetoForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      this.successMessage = null;
      this.isLoading = false;
      return;
    }

    this.errorMessage = null;

    const fv = this.projetoForm.value;
    const projetoDTO: ProjetoResumoDTO = {
      id: fv.id ?? 0,
      idCliente: fv.cliente!,
      nomeProjeto: fv.nomeProjeto!,
      observacoes: fv.observacoes ?? '',
      categoria: fv.categoria ?? '',
      estado: fv.estado!,
      cidade: fv.cidade!,
      endereco: fv.endereco!,
      dataLimiteOrcamento: fv.dataLimiteOrcamento!,
      publico: fv.visibilidade === VisibilidadeProjeto.PUBLICO,
      status: fv.status!
    };


    // NOVO: converte arquivosNovos -> arrays paralelos (mesma ordem!)
    const files: File[] = this.arquivosNovos.map(a => a.file);
    const categorias: TipoFornecedor[] = this.arquivosNovos.map(a => a.categoria);

    // (Opcional) Validação extra: tamanhos iguais
    if (files.length !== categorias.length) {
      this.errorMessage = 'Falha ao preparar anexos: divergência entre arquivos e categorias.';
      this.isLoading = false;
      return;
    }

    const novasPlantas = fv.plantaBaixa || []; //não está sendo usado, mas mantido para estrutura

    if (this.isEditMode && this.projetoId) {
      this.projetoService.atualizarProjeto(
        this.projetoId,
        projetoDTO,
        files,
        categorias,
        novasPlantas,
        this.arquivosRemoverIds,
        this.plantasRemoverIds //deixei so para manter a estrutura, mas não está sendo usado
      ).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Projeto atualizado com sucesso!';

          this.arquivosRemoverIds = [];
          this.arquivosNovos = [];
          this.submited = false;
          // this.plantasBaixas = [];
          // this.plantasRemoverIds = [];
          this.projetoForm.get('arquivos')?.reset([]);
          this.projetoForm.get('plantaBaixa')?.reset([]);

          this.dadosService.listarArquivosNormais(this.projetoId!).subscribe({
            next: res => this.arquivosProjeto = res.response,
            error: () => this.arquivosProjeto = []
          });

        },
        error: () => {
          this.errorMessage = 'Erro ao atualizar projeto.';
          this.isLoading = false;
        }
      });

    } else {
      this.projetoService.novoProjeto(
        projetoDTO,
        files,
        categorias
      ).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Projeto cadastrado com sucesso!';

          this.projetoForm.reset({
            visibilidade: VisibilidadeProjeto.PUBLICO,
            status: StatusDoProjeto.NOVO_PROJETO
          });

          this.arquivosNovos = [];
          this.arquivosProjeto = [];
          this.submited = false;
        },
        error: () => {
          this.errorMessage = 'Erro ao cadastrar projeto.';
          this.isLoading = false;
        }
      });
    }
  }

  protected onAlertCloseHandler(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}
