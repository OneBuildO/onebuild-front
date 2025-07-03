import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CidadesService, listaEstados } from 'src/app/services/services/cidade.service';
import { AlertType } from 'src/app/shared/components/alert/alert.type';
import { ERROR_MESSAGES } from 'src/app/shared/components/validation-error/error-messages';
import { ClienteCadastroDTO } from './cliente-cadastro-dto';
import { ClienteService } from 'src/app/services/services/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { ClienteProjetoDTO } from '../visualizar-clientes/cliente-projeto-dto';


@Component({
  selector: 'app-cadastro-clientes',
  templateUrl: './cadastro-clientes.component.html',
  styleUrls: ['./cadastro-clientes.component.css']
})
export class CadastroClientesComponent implements OnInit {
  public listaCidades: any[] = [];
  submited: boolean = false;
  isLoading: boolean = false;
  serverMessages: string[] = [];
  tipoAlerta = AlertType.Warning;
  isEmailValidado : boolean = true;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  successMessage: string | null = null;
  errorMessage: string | null = null;

  isEditMode = false;
  clienteId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private serviceLocalidade: CidadesService,
    private clienteService: ClienteService,
    private route:ActivatedRoute
  ) {}

  clienteForm = this.formBuilder.group({
    id: new FormControl<string | null>(null), 
    nome: new FormControl('', {validators: [Validators.required]}),
    email: new FormControl('', {validators: [Validators.required]}),
    senha: new FormControl('', {validators: [Validators.required]}),
    confirmarSenha: new FormControl('', {validators: [Validators.required]}),
    nomeProjeto: new FormControl('', {validators: [Validators.required]}),
    contato: new FormControl('',),  // Contato é opcional, sem Validators.required
    estado: new FormControl('', {validators: [Validators.required]}),
    cidade: new FormControl('', {validators: [Validators.required]}),
    cep: new FormControl('',), 
    rua: new FormControl('',),
    bairro: new FormControl('',),  
    numeroEndereco: new FormControl('',), 
  });
  

  ngOnInit(): void {
    this.verificarModoEdicao();
  }

  popularClienteForm(cliente?: ClienteCadastroDTO) {
    if(cliente) {
      // Garantir que os valores não são null
      const estado = cliente.estado ?? '';
      const cidade = cliente.cidade ?? '';
  
      this.clienteForm.setValue({
        id: cliente.id ?? null,
        nome: cliente.nome,
        nomeProjeto: cliente.nomeProjeto,
        contato: cliente.contato,
        estado: estado,
        cidade: cidade,
        email: cliente.email,
        senha: cliente.senha,
        confirmarSenha: cliente.confirmarSenha ?? '' ,
        cep:cliente.cep ?? '',
        rua: cliente.rua ?? '',
        bairro: cliente.bairro ?? '',
        numeroEndereco: cliente.numeroEndereco ?? ''
      });
  
      // Atualizar a lista de cidades com base no estado atual
      this.obterCidadePorEstado(estado);
    } else {
      this.clienteForm.reset({
        nome: '',
        nomeProjeto: '',
        contato: '',
        estado: '',
        cidade: '',
        senha: '',
        confirmarSenha: ''
      });

      this.listaCidades = []; // Limpar a lista de cidades
    }
  }

  togglePasswordVisibility() {
  this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  onEstadoChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const estadoSigla = selectElement.value;
    this.obterCidadePorEstado(estadoSigla);
  }

  obterCidadePorEstado(estadoSigla: string) {
    if (estadoSigla) {
      this.serviceLocalidade.getCidadesByEstado(estadoSigla).subscribe(data => {
        this.listaCidades = data;
      });
    } else {
      this.listaCidades = [];
    }
  }

  onSubmit() {
    this.submited = true;

    if (this.clienteForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    const dados = this.clienteForm.value;

    if (dados.senha !== dados.confirmarSenha) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    const cadastroCliente: ClienteCadastroDTO = {
      nome: dados.nome ?? '',
      email: dados.email ?? '',
      senha: dados.senha ?? '',
      confirmarSenha: dados.confirmarSenha ?? '',
      nomeProjeto: dados.nomeProjeto ?? '',
      contato: dados.contato ?? '',
      cidade: dados.cidade ?? '',
      estado: dados.estado ?? '',
      rua: dados.rua ?? '',
      bairro: dados.bairro ?? '',
      numeroEndereco: dados.numeroEndereco ?? '',
      cep: dados.cep ?? '',
    };

    if (this.clienteId && this.isEditMode) {
        this.clienteService.atualizarCliente(this.clienteId,cadastroCliente).subscribe(
          (response) => {
            console.log('Cliente atualizado:', cadastroCliente);
            this.successMessage = 'Cliente atualizado com sucesso!';
            this.errorMessage = null;
            console.log(this.clienteForm);
            this.clienteForm.reset();
            this.submited = false;

          },
          (error) => {
              console.error('Erro ao atualizar cliente:', error);
              this.errorMessage = "Erro ao atualizar. Tente novamente.";
          }
        );


    }else{
      this.clienteService.cadastrarCliente(cadastroCliente).subscribe({
        next: () => {
          console.log('Cliente cadastrado:', cadastroCliente);
          this.successMessage = 'Cliente cadastrado com sucesso!';
          this.errorMessage = null; //prevenir de aparecer a mensagem de erro dps que o usuario der o input correto.
  
          this.clienteForm.reset();        
          this.submited = false;           
        },
        error: (err) => {
          console.error('Erro ao cadastrar cliente:', err);
          this.errorMessage = "Erro ao cadastrar. Tente novamente.";
        }
      });
    }


  }

  private verificarModoEdicao():void{
    this.clienteId = this.route.snapshot.paramMap.get('id');
    if (this.clienteId) {
      this.isEditMode = true;
      this.clienteService.getClientById(this.clienteId).subscribe(
        (cliente:ClienteProjetoDTO) =>{
          this.clienteForm.patchValue({
            id:            cliente.id,
            nome:          cliente.nome,
            email:         cliente.email,
            nomeProjeto:   cliente.projetoCliente,  
            contato:       cliente.contato,
            estado:        cliente.estado,
            cidade:        cliente.cidade,
            rua:           cliente.rua,
            bairro:        cliente.bairro,
            cep:           cliente.cep,
            numeroEndereco:cliente.numeroEndereco
          });
          console.log('Cliente modo edição: ', cliente);
          this.obterCidadePorEstado(cliente.estado);
        },
        (error) => {console.error('Erro ao carregar cliente para edição', error)}
      );
    }
  }



  protected onAlertCloseHandler = (e: any) => {
    this.serverMessages = [];
  };

  protected readonly listaEstados = listaEstados;
  protected readonly ERROR_MESSAGES = ERROR_MESSAGES;
}
