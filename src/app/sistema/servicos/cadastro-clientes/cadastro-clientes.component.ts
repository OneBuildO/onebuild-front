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

  constructor(
    private formBuilder: FormBuilder,
    private serviceLocalidade: CidadesService,
    private clienteService: ClienteService
  ) {}

  clienteForm = this.formBuilder.group({
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
        nome: cliente.nome,
        projeto: cliente.projeto,
        contato: cliente.contato,
        estado: estado,
        cidade: cidade,
        email: cliente.email,
        senha: cliente.senha,
        confirmarSenha: cliente.confirmarSenha
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
      return;
    }

    const dados = this.clienteForm.value;

    if (dados.senha !== dados.confirmarSenha) {
      return;
    }

    console.log('Dados enviados:', dados);
    // Aqui você pode chamar um serviço para enviar os dados para o backend
  }
  

  // protected onFormSubmitHandler = () => {
  //   this.submited = true;
  //   this.serverMessages = []

  //   if (this.clienteForm.invalid) return

  //   const cadastroCliente: ClienteResumoDTO = {
  //     id: this.clienteForm.controls?.id?.value,
  //     idUsuario: this.servicesetShared.getUserSharedData().id,
  //     nome: this.clienteForm.controls?.nome?.value,
  //     projeto: this.clienteForm.controls?.projeto?.value,
  //     contato: this.clienteForm.controls?.contato?.value,
  //     estado: this.clienteForm.controls?.estado?.value,
  //     cidade: this.clienteForm.controls?.cidade?.value,
  //     token: null,
  //   }

  //   if (cadastroCliente.id && cadastroCliente.id != 0) {
  //     this.serviceCliente.editClient(cadastroCliente)
  //       .subscribe({
  //         next: (data: any) => {
  //           this.isLoading = false;
  //           this.handleModal()
  //           localStorage.setItem('successMessage', `Cliente ${cadastroCliente.nome} editado com sucesso!`);
  //           window.location.reload();
  //         },
  //         error: (err) => {
  //           this.tipoAlerta = AlertType.Danger
  //           this.serverMessages.push(err.error)
  //           this.isLoading = false;
  //         }
  //       });
  //   } else {
  //     this.serviceCliente.saveNewClient(cadastroCliente)
  //       .subscribe({
  //         next: (data: any) => {
  //           this.tipoAlerta = AlertType.Success
  //           this.isLoading = false;
  //           this.handleModal()
  //           localStorage.setItem('successMessage', `Cliente ${cadastroCliente.nome} salvo com sucesso!`);
  //           window.location.reload();
  //         },
  //         error: (err) => {
  //           this.tipoAlerta = AlertType.Danger
  //           this.serverMessages.push(err.error)
  //           this.isLoading = false;
  //         }
  //       });
  //   }
  // };



  protected onAlertCloseHandler = (e: any) => {
    this.serverMessages = [];
  };

  protected readonly listaEstados = listaEstados;
  protected readonly ERROR_MESSAGES = ERROR_MESSAGES;
}
