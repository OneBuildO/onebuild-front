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
  errorMessage: string | null = null;
  submited: boolean = false;


  passwordFieldType: string = 'password';

  loginForm = this.formBuilder.group({
    username: new FormControl('', { validators: [Validators.required] }),
    password: new FormControl('', { validators: [Validators.required] }),
  });

  protected onFormSubmitHandler = (event: SubmitEvent) => {
    event.preventDefault();
    this.submited = true;
    this.errorMessage = null;

    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const email = this.loginForm.controls.username.value ?? '';
    const senha = this.loginForm.controls.password.value ?? '';

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

        const role = data.authorities.length > 0 ? data.authorities[0] : null;

        const usuario: Usuario = {
          idUsuario: userId,
          nome: data.nome ?? '',
          senha: '',
          cidade: data.cidade ?? '',
          email: data.email ?? '',
          cnpj: data.cnpj ?? '',
          contato: data.contato ?? '',
          dataCadastro: data.dataCadastro ?? '',
          endereco: data.endereco ?? '',
          estado: data.estado ?? '',
          tipoUsuario: role,
          projeto: data.projeto ?? '',
          tipoFornecedor: data.tipoFornecedor ?? '',
          fotoUsuario: data.fotoUsuario ?? null
        };

        
        localStorage.setItem('usuario', JSON.stringify(usuario));

        switch (usuario.tipoUsuario) {
          case 'ROLE_ADMIN':
            this.router.navigate(['/usuario/dashboard-admin']);
            break;
          case 'ROLE_CLIENTE':
            this.router.navigate(['/usuario/dashboard-cliente']);
            break;
          case 'ROLE_FORNECEDOR':
            this.router.navigate(['/usuario/dashboard-fornecedor']);
            break;
          case 'ROLE_ARQUITETO':
            this.router.navigate(['/usuario/dashboard-arquiteto']);
            break;
          case 'ROLE_CONSTRUTORA':
            this.router.navigate(['/usuario/dashboard-contrutora']);
            break;
          case 'ROLE_DESIGN_INTERIORES':
            this.router.navigate(['/usuario/dashboard-design-de-interior']);
            break;
          default:
            this.router.navigate(['/forbidden']);
            break;
        }

        this.isLoading = false;
      },
      error: (error) => {
          this.isLoading = false;
          const errorDesc = error?.error?.error_description || error?.error?.message;

          if (error.status === 400 && error?.error?.error === 'invalid_grant') {
            this.errorMessage = 'E-mail e/ou senha inválidos.';
          } else if (error.status === 401) {
            this.errorMessage = 'Não autorizado. Verifique suas credenciais.';
          } else {
            this.errorMessage = errorDesc || 'Não foi possível entrar. Tente novamente.';
          }
      }
    });

    this.scrollTop();
  };


  protected onAlertCloseHandler = (e: any) => {
    this.serverMessages = [];
    this.errorMessage = null;
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
