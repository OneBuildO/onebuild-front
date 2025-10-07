import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';

@Component({
  selector: 'app-tela-redefinir-senha',
  templateUrl: './tela-redefinir-senha.component.html',
  styleUrls: ['./tela-redefinir-senha.component.css']
})
export class TelaRedefinirSenhaComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  token: string | null = null;
  mensagemSucesso: string = '';
  errors: string[] = [];

  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const queryParams = new URLSearchParams(window.location.search);
    this.token = queryParams.get('token');
    console.log(this.token);
  }


  get hasMinLen() { return (this.newPassword || '').length >= 8; }
  get hasUpper()  { return /[A-Z]/.test(this.newPassword || ''); }
  get hasLower()  { return /[a-z]/.test(this.newPassword || ''); }
  get hasSpecial(){ return /[^a-zA-Z0-9]/.test(this.newPassword || ''); }

  get passwordValid() { return this.hasMinLen && this.hasUpper && this.hasLower && this.hasSpecial; }

  get unmet(): string[] {
    const faltas = [];
    if (!this.hasMinLen) faltas.push('8+ caracteres');
    if (!this.hasUpper)  faltas.push('1 maiúscula');
    if (!this.hasLower)  faltas.push('1 minúscula');
    if (!this.hasSpecial)faltas.push('1 símbolo');
    return faltas;
  }

  goToResetPassword() {
    this.errors = [];

    if (!this.token) {
      this.errors.push('Token inválido ou expirado.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errors.push('As senhas não coincidem.');
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe(
      (response: any) => {
        this.mensagemSucesso =
          response?.message || 'Senha redefinida com sucesso!';
        this.confirmPassword = '';
        this.newPassword = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      (error) => {
        const msg = (error?.error?.erro || error?.message || '').toString().toLowerCase();
        console.log(msg);
        if (error.status === 400) {
          this.errors = ['E-mail não encontrado ou inválido.'];
        } else if (error.status === 500) {
          this.errors = ['Erro ao atualizar senha.'];
        } else {
          this.errors = ['Erro desconhecido na atualização de senha.'];
        }
      }
    );
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }


}
