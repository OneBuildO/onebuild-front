import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/services/auth.service';
import { LoginDTO } from '../sistema/LoginDTO';
import { Usuario } from './usuario';
import { AlertType } from '../shared/components/alert/alert.type';

@Component({
  selector: 'app-login',  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  protected readonly AlertType = AlertType;


  ngOnInit(): void {
  }

  isLoading: boolean = false;
  tipoAlerta = AlertType.Warning;
  serverMessages: string[] = [];
  submited: boolean = false;


  passwordFieldType: string = 'password';

  loginForm = this.formBuilder.group({
    username: new FormControl('', { validators: [Validators.required] }),
    password: new FormControl('', { validators: [Validators.required] }),
  });

  protected onFormSubmitHandler = (event: SubmitEvent) => {
      event.preventDefault();
      this.submited = true;
      // this.serverMessages = [];

      if (this.loginForm.invalid) return;

      this.isLoading = true;
      const email = this.loginForm.controls.username.value ?? ''
      const senha = this.loginForm.controls.password.value ?? ''

      const dadosLogin: LoginDTO = {
        email: email,
        senha: senha
      };

      this.authService.login(dadosLogin).subscribe({
        next: (data: any) => {
          this.tipoAlerta = AlertType.Success;
          const access_token = data.access_token;
          localStorage.setItem('access_token', access_token);
          
          const userId = this.authService.getUserIdFromToken() ?? '';
          localStorage.setItem('user_id', userId);
          
          const usuario: Usuario = {
            idUsuario: userId,
            nome: data.nome ?? '',
            senha: '',
            cidade: data.cidade ?? '',
            email: data.email ?? '',
            cnpj: data.cnjpj ?? '',
            contato: data.contato ?? '',
            dataCadastro: data.dataCadasto ?? '',
            endereco: data.endereco ?? '', 
            estado: data.estado ?? '',
            permissaoDoUsuario: data.authorities.length > 0 ? data.authorities[0] : null,
            projeto: data.projeto ?? '',
            tipoFornecedor: data.tipoFornecedor ?? ''
          }
          
          console.log(usuario);
          localStorage.setItem('usuario', JSON.stringify(usuario));

          if(
            usuario.permissaoDoUsuario === 'ROLE_ADMIN' ||
            usuario.permissaoDoUsuario === 'ROLE_ARQUITETO' ||
            usuario.permissaoDoUsuario === 'ROLE_CONSTRUTORA' ||
            usuario.permissaoDoUsuario === 'ROLE_CLIENTE' ||
            usuario.permissaoDoUsuario === 'ROLE_DESIGN_INTERIORES' ||
            usuario.permissaoDoUsuario === 'ROLE_FORNECEDOR'
          ) {
            this.router.navigate(['/usuario/painel-principal-admin']);

          } else {
            this.router.navigate(['/forbidden']);
          }

          this.isLoading = false;
        },
        error: (err) => {
          this.tipoAlerta = AlertType.Danger;
          this.serverMessages.push(err.error);
          this.isLoading = false;
        }
      });

      this.scrollTop();
  };

  protected onAlertCloseHandler = (e: any) => {
    this.serverMessages = [];
  };

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onLoginClick() {
    const event = new Event('submit', { cancelable: true });
    this.onFormSubmitHandler(event as SubmitEvent);
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

}
