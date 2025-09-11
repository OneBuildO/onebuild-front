import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CidadesService, listaEstados } from '../services/services/cidade.service';
import { Permissao } from '../login/permissao';
import { TipoFornecedorDescricoes } from '../login/tipoFornecedorDescricoes';
import { TipoFornecedor } from '../login/tipoFornecedor';
import { AuthService } from '../services/services/auth.service';
import { UsuarioService } from '../services/services/usuario.service';
import { CadastroUsuarioDTO } from './cadastroUsuarioDTO';
import { PermissaoDescricoes } from '../login/permissao-descricao';

@Component({
  selector: 'app-tela-cadastro',
  templateUrl: './tela-cadastro.component.html',
  styleUrls: ['./tela-cadastro.component.css']
})
export class TelaCadastroComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private serviceLocalidade: CidadesService
  ) {}

  public listaCidades: any[] = [];

  isLoading: boolean = false;
  submited: boolean = false;

  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  serverMessage: string = '';
  tipoAlerta: 'success' | 'danger' = 'success';

  enderecoCompleto: string = '';
  enderecoSelecionado: boolean = false;
  enderecosSugestoes: any[] = [];



  cadastroForm = this.formBuilder.group(
    {
      nome: new FormControl('', [Validators.required]),
      permissaoDoUsuario: new FormControl('', [Validators.required]),
      tipoFornecedor: new FormControl(''), 
      email: new FormControl('', [Validators.required]),
      contato: new FormControl('', [Validators.required]),
      cnpj: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
      terms: new FormControl(false, [Validators.requiredTrue]),
      estado: new FormControl('', [Validators.required]),
      cidade: new FormControl('', [Validators.required]),
      endereco: new FormControl('', [Validators.required])
    },
    {
      validators: this.passwordsMatchValidator() // Valida se senha e confirmação coincidem
    }
  );

  ngOnInit() {
      this.permissoesDisponiveis = this.PermissaoKeys.filter(p =>
      p !== Permissao.ADMIN && p !== Permissao.CLIENTE
    );
  }

  onFormSubmitHandler(event?: Event) {
    if (event) event.preventDefault();
    this.submited = true;
    this.serverMessage = '';

    if (this.cadastroForm.invalid) {
      this.tipoAlerta = 'danger';
      this.serverMessage = 'Por favor, preencha todos os campos corretamente.';
      this.scrollTop();
      return;
    }

    this.isLoading = true;

    const permissao = this.cadastroForm.get('permissaoDoUsuario')?.value as Permissao;
    const tipoFornecedor = permissao === Permissao.FORNECEDOR ? this.cadastroForm.get('tipoFornecedor')?.value as TipoFornecedor : undefined;

    const permissaoFormatado = permissao && permissao.startsWith("ROLE_")
    ? permissao.replace("ROLE_", "")
    : permissao || undefined;

    const dadosCadastro: CadastroUsuarioDTO = {
      nome: this.cadastroForm.get('nome')?.value ?? '',
      permissaoDoUsuario: permissaoFormatado as Permissao,
      tipoFornecedor: tipoFornecedor,
      email: this.cadastroForm.get('email')?.value ?? '',
      contato: this.cadastroForm.get('contato')?.value ?? '',
      cnpj: this.cadastroForm.get('cnpj')?.value ?? '',
      senha: this.cadastroForm.get('senha')?.value ?? '',
      confirmarSenha: this.cadastroForm.get('confirmPassword')?.value ?? '',
      estado: this.cadastroForm.get('estado')?.value ?? '',
      cidade: this.cadastroForm.get('cidade')?.value ?? '',
      endereco: this.cadastroForm.get('endereco')?.value ?? ''
    };
    
    
    this.usuarioService.saveUser(dadosCadastro).subscribe({
      next: () => {
        this.tipoAlerta = 'success';
        this.serverMessage = 'Usuário cadastrado com sucesso.';
        this.isLoading = false;
        this.cadastroForm.reset();
      },
      error: (err: any) => {
        this.tipoAlerta = 'danger';
        this.serverMessage = err?.error ?? 'Ocorreu um erro ao cadastrar o usuário.';
        this.isLoading = false;
        this.scrollTop();
      }
    });
  }

  handleChange() {
    this.serverMessage = '';
    this.isSenhaValida();
  }

  togglePasswordVisibility() {
  this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  isSenhaValida() {
    const senha = this.cadastroForm.controls.senha.value;
    const confirmPassword = this.cadastroForm.controls.confirmPassword.value;

    if (!senha || senha.length < 8) {
      this.serverMessage = 'Sua senha deve conter pelo menos 8 caracteres';
      this.scrollTop();
      return false;
    }

    if (confirmPassword && senha !== confirmPassword) {
      this.serverMessage = 'As senhas informadas não coincidem';
      this.scrollTop();
      return false;
    }

    return true;
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectEndereco(endereco: { name: string; full_address: string }): void {
    this.enderecoCompleto = endereco.full_address;
    this.enderecoSelecionado = true;
    this.enderecosSugestoes = [];
    this.cadastroForm.get('endereco')?.setValue(endereco.full_address);
  }

  private validateEnderecoSelecionado(): ValidatorFn {
    return (_: AbstractControl): { [key: string]: any } | null => {
      return this.enderecoSelecionado ? null : { enderecoInvalido: true };
    };
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const senha = group.get('senha')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return senha && confirmPassword && senha !== confirmPassword ? { passwordMismatch: true } : null;
    };
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

  public readonly PermissaoKeys = Object.values(Permissao);
  public permissoesDisponiveis: Permissao[] = null!;
  public readonly PermissaoDescricoes = PermissaoDescricoes;

  public readonly Permissao = Permissao;

  public readonly TipoFornecedorKeys = Object.keys(TipoFornecedor) as TipoFornecedor[];
  public readonly TipoFornecedorDescricoes = TipoFornecedorDescricoes;
  protected readonly listaEstados = listaEstados;
}
