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
  submited = false;
  isLoading = false;

  passwordFieldType = 'password';
  confirmPasswordFieldType = 'password';

  successMessage: string | null = null;
  errorMessage: string | null = null;

  isEditMode = false;
  clienteId: string | null = null;

  protected readonly listaEstados = listaEstados;
  protected readonly ERROR_MESSAGES = ERROR_MESSAGES;

  clienteForm = this.formBuilder.group({
    id: new FormControl<string | null>(null),
    nome: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', { validators: [Validators.required] }),
    senha: new FormControl('', { validators: [Validators.required] }),
    confirmarSenha: new FormControl('', { validators: [Validators.required] }),
    contato: new FormControl(''),
    estado: new FormControl('', { validators: [Validators.required] }),
    cidade: new FormControl('', { validators: [Validators.required] }),
    cep: new FormControl(''),
    rua: new FormControl(''),
    bairro: new FormControl(''),
    numeroEndereco: new FormControl(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    private serviceLocalidade: CidadesService,
    private clienteService: ClienteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.verificarModoEdicao();
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordFieldType =
      this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  onEstadoChange(event: Event) {
    const estadoSigla = (event.target as HTMLSelectElement).value;
    this.obterCidadePorEstado(estadoSigla);
  }

  obterCidadePorEstado(estadoSigla: string) {
    if (estadoSigla) {
      this.serviceLocalidade.getCidadesByEstado(estadoSigla)
        .subscribe(data => this.listaCidades = data);
    } else {
      this.listaCidades = [];
    }
  }

  onSubmit() {
    this.submited = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;

    // Validações de formulário
    if (this.clienteForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      this.isLoading = false;
      return;
    }

    const dados = this.clienteForm.value;
    if (dados.senha !== dados.confirmarSenha) {
      this.errorMessage = 'As senhas não coincidem.';
      this.isLoading = false;
      return;
    }

    // Monta DTO
    const cadastroCliente: ClienteCadastroDTO = {
      nome: dados.nome!,
      email: dados.email!,
      senha: dados.senha!,
      confirmarSenha: dados.confirmarSenha!,
      contato: dados.contato ?? '',
      cidade: dados.cidade!,
      estado: dados.estado!,
      rua: dados.rua ?? '',
      bairro: dados.bairro ?? '',
      numeroEndereco: dados.numeroEndereco ?? '',
      cep: dados.cep ?? '',
    };

    // Define qual chamada usar
    const request$ = this.isEditMode && this.clienteId
      ? this.clienteService.atualizarCliente(this.clienteId, cadastroCliente)
      : this.clienteService.cadastrarCliente(cadastroCliente);

    request$.subscribe({
      next: () => {
        this.successMessage = this.isEditMode
          ? 'Cliente atualizado com sucesso!'
          : 'Cliente cadastrado com sucesso!';
        this.clienteForm.reset();
        this.submited = false;
        this.isLoading = false;
      },
      error: err => {
        console.error('Erro na requisição:', err);
        this.errorMessage = this.isEditMode
          ? 'Erro ao atualizar. Tente novamente.'
          : 'Erro ao cadastrar. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  private verificarModoEdicao(): void {
    this.clienteId = this.route.snapshot.paramMap.get('id');
    if (!this.clienteId) { return; }

    this.isEditMode = true;
    this.clienteService.getClientById(this.clienteId)
      .subscribe({
        next: (cliente: ClienteProjetoDTO) => {
          this.clienteForm.patchValue({
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            contato: cliente.contato,
            estado: cliente.estado,
            cidade: cliente.cidade,
            rua: cliente.rua,
            bairro: cliente.bairro,
            cep: cliente.cep,
            numeroEndereco: cliente.numeroEndereco
          });
          this.obterCidadePorEstado(cliente.estado);
        },
        error: err => {
          console.error('Erro ao carregar cliente para edição:', err);
        }
      });
  }
}
