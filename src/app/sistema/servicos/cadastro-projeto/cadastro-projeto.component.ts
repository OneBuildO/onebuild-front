import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-cadastro-projeto',
  templateUrl: './cadastro-projeto.component.html',
  styleUrls: ['./cadastro-projeto.component.css']
})
export class CadastroProjetoComponent implements OnInit {
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

  submited = false;
  isEditMode = false;
  projetoId: number | null = null;
  isLoading:boolean = false;

  arquivosProjeto: ArquivosProjetoDTO[] = [];
  // plantaBaixa: ArquivosProjetoDTO[] = [];

  arquivosRemoverIds: number[] = [];
  plantasRemoverIds: number[] = []; //não está sendo usado, mas mantido para estrutura

  clientes: ProjetoUsuarioDTO[] = [];
  listaCidades: any[] = [];

  tipoFornecedorArr: TipoFornecedor[] = Object
  .values(TipoFornecedor)
  .sort((a, b) => a.localeCompare(b));

  protected readonly listaEstados = listaEstados;
  statusProjetoArr = Object.values(StatusDoProjeto) as StatusDoProjeto[];
  visibilidadeProjetoArr = Object.values(VisibilidadeProjeto) as VisibilidadeProjeto[];
  protected readonly StatusDoProjetoDescricoes = StatusDoProjetoDescricoes;
  protected readonly ERROR_MESSAGES = ERROR_MESSAGES;
  readonly TipoFornecedorDescricoes = TipoFornecedorDescricoes;

  successMessage: string | null = null;
  errorMessage: string | null = null;
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
    private dadosService: DadosService
  ) {}

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

          this.obterCidadePorNomeEstado(projeto.estado);

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

  onEstadoChange(event: Event): void {
    const estado = (event.target as HTMLSelectElement).value;
    this.obterCidadePorNomeEstado(estado);
  }

  private obterCidadePorNomeEstado(estadoNome: string): void {
    if (!estadoNome) {
      this.listaCidades = [];
      return;
    }
    this.cidadeService.getCidadesByNomeEstado(estadoNome).subscribe({
      next: data => this.listaCidades = data,
      error: () => this.listaCidades = []
    });
  }

  onArquivosSelecionados(arquivos: File[]): void {
    const arquivosValidos = this.validarArquivos(arquivos);
    if (arquivosValidos.length < arquivos.length) {
      this.errorMessage = 'Alguns arquivos foram ignorados por não serem dos tipos permitidos (PNG, JPEG, PDF, DOC, DOCX).';
    }
    this.projetoForm.get('arquivos')?.setValue(arquivosValidos);
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
    
    const novosArquivos = fv.arquivos || [];
    const novasPlantas = fv.plantaBaixa || [];

    if (this.isEditMode && this.projetoId) {
      this.projetoService.atualizarProjeto(
        this.projetoId,
        projetoDTO,
        novosArquivos,
        novasPlantas,
        this.arquivosRemoverIds,
        this.plantasRemoverIds //deixei so para manter a estrutura, mas não está sendo usado
      ).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Projeto atualizado com sucesso!';

          this.arquivosRemoverIds = [];
          // this.plantasRemoverIds = [];
          this.projetoForm.get('arquivos')?.reset([]);
          this.projetoForm.get('plantaBaixa')?.reset([]);
          

          this.dadosService.listarArquivosNormais(this.projetoId!).subscribe({
            next: res => this.arquivosProjeto = res.response,
            error: () => this.arquivosProjeto = []
          });

          // this.dadosService.listarPlantasBaixas(this.projetoId!).subscribe({
          //   next: res => this.plantaBaixa = res.response,
          //   error: () => this.plantaBaixa = []
          // });
        },
        error: () => {
          this.errorMessage = 'Erro ao atualizar projeto.';
          this.isLoading = false;
        }
      });

    } else {
      this.projetoService.novoProjeto(
        projetoDTO,
        novosArquivos,
        novasPlantas
      ).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Projeto cadastrado com sucesso!';
          
          this.projetoForm.reset({
            visibilidade: VisibilidadeProjeto.PUBLICO,
            status: StatusDoProjeto.NOVO_PROJETO
          });

          this.arquivosProjeto = [];
          // this.plantaBaixa = [];
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
