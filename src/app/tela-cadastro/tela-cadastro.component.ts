import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

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
    private usuarioService: UsuarioService
  ) {}

  public listaCidades: any[] = [];

  isLoading: boolean = false;
  submited: boolean = false;

  serverMessage: string = '';
  tipoAlerta: 'success' | 'danger' = 'success';

  enderecoCompleto: string = '';
  enderecoSelecionado: boolean = false;
  enderecosSugestoes: any[] = [];

  cadastroForm = this.formBuilder.group({
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
    endereco: new FormControl('', [Validators.required, this.validateEnderecoSelecionado()])
  });

  ngOnInit() {
    this.cadastroForm.get('permissaoDoUsuario')?.valueChanges.subscribe(value => {
      if (value === Permissao.FORNECEDOR) {
        this.cadastroForm.get('tipoFornecedor')?.setValidators([Validators.required]);
      } else {
        this.cadastroForm.get('tipoFornecedor')?.clearValidators();
      }
      this.cadastroForm.get('tipoFornecedor')?.updateValueAndValidity();
    });
  }

  onFormSubmitHandler(event?: Event) {
    if (event) event.preventDefault();
    this.submited = true;
    this.serverMessage = '';

    if (this.cadastroForm.invalid || !this.isSenhaValida()) return;
    this.isLoading = true;

    const permissao = this.cadastroForm.get('permissaoDoUsuario')?.value as Permissao;
    const tipoFornecedor = permissao === Permissao.FORNECEDOR ? this.cadastroForm.get('tipoFornecedor')?.value as TipoFornecedor : undefined;

    const dadosCadastro: CadastroUsuarioDTO = {
      nome: this.cadastroForm.get('nome')?.value || '',
      permissaoDoUsuario: permissao,
      tipoFornecedor: tipoFornecedor,
      email: this.cadastroForm.get('email')?.value || '',
      contato: this.cadastroForm.get('contato')?.value || '',
      cnpj: this.cadastroForm.get('cnpj')?.value || '',
      senha: this.cadastroForm.get('senha')?.value || '',
      estado: this.cadastroForm.get('estado')?.value || '',
      cidade: this.cadastroForm.get('cidade')?.value || '',
      endereco: this.enderecoCompleto || ''
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
        this.serverMessage = err?.error || 'Ocorreu um erro ao cadastrar o usuário.';
        this.isLoading = false;
        this.scrollTop();
      }
    });
  }

  handleChange() {
    this.serverMessage = '';
    this.isSenhaValida();
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


  public readonly PermissaoKeys = Object.keys(Permissao) as Permissao[];
  public readonly PermissaoDescricoes = PermissaoDescricoes;

  public readonly Permissao = Permissao;


  public readonly TipoFornecedorKeys = Object.keys(TipoFornecedor) as TipoFornecedor[];
  public readonly TipoFornecedorDescricoes = TipoFornecedorDescricoes;

}