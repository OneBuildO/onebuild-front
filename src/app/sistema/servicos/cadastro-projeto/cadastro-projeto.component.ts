import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ERROR_MESSAGES } from 'src/app/shared/components/validation-error/error-messages';
import { AlertType } from 'src/app/shared/components/alert/alert.type';
import { StatusDoProjeto } from './statusDoProjeto';
import { VisibilidadeProjeto } from './visibilidade-projeto.enum';
import { StatusDoProjetoDescricoes } from './statusDoProjetoDescricoes';
import { CidadesService, listaEstados } from 'src/app/services/services/cidade.service';
import { EMensagemAviso } from './mensagem-aviso.enum';
import { ProjetoService } from 'src/app/services/services/projeto.service';
import { ProjetoUsuarioDTO } from './projeto-usuario-dto';
import { Projeto } from './projeto';

@Component({
  selector: 'app-cadastro-projeto',
  templateUrl: './cadastro-projeto.component.html',
  styleUrls: ['./cadastro-projeto.component.css']
})
export class CadastroProjetoComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private serviceLocalidade: CidadesService,
    private projetoService: ProjetoService
  ) { }
  
  arquivosProjeto: (
    | File
    | { documentoUrl: string; id: number; name: string }
  )[] = [];

  plantaBaixa: (
    | File
    | { documentoUrl: string; id: number; name: string }
  )[] = [];

  idClienteSelecionado: number = 0;
  isLoading: boolean = false;
  isLoadingFile: boolean = false;
  tipoAlerta = AlertType.Warning;

  successMessage: string | null = null; 
  errorMessage: string | null = null;
  submited:boolean = false;

  clientes: ProjetoUsuarioDTO[] = [];
  //arquivos: File[] = [];
  //plantaBaixaArquivos: File[] = [];

  protected readonly listaEstados = listaEstados;
  public listaCidades: any[] = [];

  categoriasProjeto = []; //tem que pegar la do back-end.
  statusProjeto = StatusDoProjeto; // Adicione o enum ao contexto do componente
  
  visibilidadeProjetoArr: VisibilidadeProjeto[] = Object.values(VisibilidadeProjeto) as VisibilidadeProjeto[];
  statusProjetoArr: StatusDoProjeto[] = Object.values(StatusDoProjeto) as StatusDoProjeto[];
  protected readonly StatusDoProjetoDescricoes = StatusDoProjetoDescricoes;

  protected readonly ERROR_MESSAGES = ERROR_MESSAGES;

  ngOnInit(): void {
    this.carregarClientes();
  }

  projetoForm = this.formBuilder.group({
    id: new FormControl(0, { validators: [Validators.required] }),
    cliente: new FormControl('',{ validators: [Validators.required] }),
    arquivos: new FormControl<
      Array<File | { documentoUrl: string; id: number; name: string }>
    >([]),
    plantaBaixa: new FormControl<
      Array<File | { documentoUrl: string; id: number; name: string }>
    >([]),
    // categoria: new FormControl('',{ validators: [Validators.required] }), //COMENTEI SO PRA ENQUANTO NAO TIVER AS CATEGORIAS, EU FAZER O POST
    categoria: new FormControl(''),
    dataLimiteOrcamento: new FormControl('', {validators: [Validators.required]}),
    observacoes: new FormControl(''),
    estado: new FormControl('', { validators: [Validators.required] }),
    cidade: new FormControl('', { validators: [Validators.required] }),
    endereco: new FormControl('', { validators: [Validators.required] }),
    visibilidade: new FormControl(VisibilidadeProjeto.PUBLICO),
    status: new FormControl(StatusDoProjeto.NOVO_PROJETO, {validators: [Validators.required]}),
  });

  onEstadoChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const estadoNome = selectElement.value;
    this.obterCidadePorNomeEstado(estadoNome);
  }

  obterCidadePorNomeEstado(estadoNome: string) {
    if (estadoNome) {
      this.serviceLocalidade.getCidadesByNomeEstado(estadoNome).subscribe(
        (data) => {
          this.listaCidades = data;
        },
        (error) => {
          this.listaCidades = [];
        }
      );
    } else {
      this.listaCidades = [];
    }
  }

  carregarClientes(): void {
    this.projetoService.obterClientes().subscribe({
      next: (res) => {
        this.clientes = res.response;
        console.log('Clientes carregados:', this.clientes);
      },
      error: (err) => {
        console.error('Erro ao obter clientes:', err);
      }
    });
  }

  onSubmit(): void {
    this.submited = true;

    const formValue = this.projetoForm.value;
    const arquivos: File[] = (formValue.arquivos ?? []).filter(
      (a): a is File => a instanceof File)

    const plantaBaixaArquivos: File[] = (formValue.plantaBaixa ?? []).filter(
    (a): a is File => a instanceof File);

    if (this.projetoForm.invalid) {
      this.errorMessage = "Por favor, preencha todos os campos obrigatórios.";
      return;
    }

    const projeto: Projeto = {
      idUsuario: formValue.cliente ?? '',
      observacoes: formValue.observacoes ?? '',
      categoria: formValue.categoria ?? '',
      estado: formValue.estado ?? '',
      cidade: formValue.cidade ?? '', 
      endereco: formValue.endereco ?? '',
      dataLimiteOrcamento: formValue.dataLimiteOrcamento ?? '',
      publico: formValue.visibilidade === VisibilidadeProjeto.PUBLICO, 
      status: formValue.status ?? StatusDoProjeto.EM_ANDAMENTO
      };

      console.log(projeto);

      this.projetoService.novoProjeto(projeto, arquivos, plantaBaixaArquivos).subscribe({
        next: (res) => {
          console.log('Projeto cadastrado com sucesso!', res);
          this.successMessage = "Projeto cadastrado com sucesso!";
        },
        error: (err) => {
          console.error('Erro ao cadastrar projeto:', err);
          this.errorMessage = "Erro ao cadastrar projeto!";
        }
      });
  }



  processFiles(files: FileList, tipo: string) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (tipo === 'plantaBaixa') {
        // Adiciona o arquivo ao array plantaBaixa, se ele não existir ainda
        if (!this.plantaBaixa.some((f) => f.name === file.name)) {
          this.plantaBaixa.push(file);
        }
      } else {
        // Adiciona ao array arquivosProjeto, se ele não existir ainda
        if (!this.arquivosProjeto.some((f) => f.name === file.name)) {
          this.arquivosProjeto.push(file);
        }
      }
    }
  }


  handleRemoveFile(fileName: string, tipo: string) {
    if (tipo === 'arquivosProjeto') {
      this.arquivosProjeto = this.arquivosProjeto.filter(
        (file) => file.name !== fileName
      );
    } else if (tipo === 'plantaBaixa') {
      this.plantaBaixa = this.plantaBaixa.filter(
        (file) => file.name !== fileName
      );
    }
  }  

  onArquivosSelecionados(
    arquivos: (File|{ id: number; name: string; documentoUrl: string })[]
  ): void {
    this.arquivosProjeto = arquivos;
    this.projetoForm.get('arquivos')?.setValue(arquivos);
    console.log('Arquivos selecionados:', arquivos);
  }

  onPlantaBaixaSelecionados(
    arquivos: Array<File | { documentoUrl: string; id: number; name: string }>
  ) {
    this.plantaBaixa = arquivos;
    this.projetoForm.get('plantaBaixa')?.setValue(this.plantaBaixa);
      console.log('PlantaBaixa selecionados:', arquivos);
  }

  handleFilesProject(event: any, tipo: string) {
    const file = event.target.files[0];
    const tiposPermitidos = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];

    if (tiposPermitidos.includes(file.type)) {
      const tamanhoMaximoMB = 10;
      const tamanhoMaximoBytes = tamanhoMaximoMB * 1024 * 1024;

      if (file.size <= tamanhoMaximoBytes) {
        // Verifica o tipo e adiciona ao array correspondente
        if (tipo === 'arquivosProjeto') {
          this.arquivosProjeto.push(file);
        } else if (tipo === 'plantaBaixa') {
          this.plantaBaixa.push(file);
        }
      } else {
        // this.toastr.error(
        //   EMensagemAviso.TAMANHO_ARQUIVO_NAO_VALIDADO,
        //   EMensagemAviso.ATENCAO
        // );
      }
    } else { //JAMAIS USAR TOASTR DE NOVO, PLMDS
      // this.toastr.error(
      //   EMensagemAviso.TIPO_ARQUIVO_NAO_VALIDADO,
      //   EMensagemAviso.ATENCAO
      // );
    }
  }



}
