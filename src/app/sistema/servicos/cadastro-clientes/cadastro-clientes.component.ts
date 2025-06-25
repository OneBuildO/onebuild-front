import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CidadesService, listaEstados } from 'src/app/services/services/cidade.service';
import { AlertType } from 'src/app/shared/components/alert/alert.type';
import { ERROR_MESSAGES } from 'src/app/shared/components/validation-error/error-messages';
import { ClienteCadastroDTO } from './cliente-cadastro-dto';
import { ClienteService } from 'src/app/services/services/cliente.service';


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
  apiErrors: string[] = [];
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  constructor(
    private formBuilder: FormBuilder,
    private serviceLocalidade: CidadesService,
    private clienteService: ClienteService
  ) {}

  clienteForm = this.formBuilder.group({
    id: new FormControl<string | null>(null), 
    nome: new FormControl('', {validators: [Validators.required]}),
    email: new FormControl('', {validators: [Validators.required]}),
    senha: new FormControl('', {validators: [Validators.required]}),
    confirmarSenha: new FormControl('', {validators: [Validators.required]}),
    projeto: new FormControl('', {validators: [Validators.required]}),
    contato: new FormControl('',),  // Contato é opcional, sem Validators.required
    estado: new FormControl('', {validators: [Validators.required]}),
    cidade: new FormControl('', {validators: [Validators.required]}),
  });
  
  successMessage: string | null = null;
  
  ngOnInit(): void {

  }

  popularClienteForm(cliente?: ClienteCadastroDTO) {
    if(cliente) {
      // Garantir que os valores não são null
      const estado = cliente.estado ?? '';
      const cidade = cliente.cidade ?? '';
  
      this.clienteForm.setValue({
        id: cliente.id ?? null,
        nome: cliente.nome,
        projeto: cliente.projeto,
        contato: cliente.contato,
        estado: estado,
        cidade: cidade,
        email: cliente.email,
        senha: cliente.senha,
        confirmarSenha: cliente.confirmarSenha ?? '' 
      });
  
      // Atualizar a lista de cidades com base no estado atual
      this.obterCidadePorEstado(estado);
    } else {
      this.clienteForm.reset({
        nome: '',
        projeto: '',
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
      console.warn('Formulário inválido');
      return;
    }

    const dados = this.clienteForm.value;

    if (dados.senha !== dados.confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    const cadastroCliente: ClienteCadastroDTO = {
      nome: dados.nome ?? '',
      email: dados.email ?? '',
      senha: dados.senha ?? '',
      confirmarSenha: dados.confirmarSenha ?? '',
      projeto: dados.projeto ?? '',
      contato: dados.contato ?? '',
      cidade: dados.cidade ?? '',
      estado: dados.estado ?? '',
    };


    this.clienteService.cadastrarCliente(cadastroCliente).subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso!');
        console.log('Cliente cadastrado:', cadastroCliente);

        this.clienteForm.reset();        
        this.submited = false;           
      },
      error: (err) => {
        console.error('Erro ao cadastrar cliente:', err);
        alert('Erro ao cadastrar. Tente novamente.');
      }
    });
  }

  protected onAlertCloseHandler = (e: any) => {
    this.serverMessages = [];
  };

  protected readonly listaEstados = listaEstados;
  protected readonly ERROR_MESSAGES = ERROR_MESSAGES;
}
