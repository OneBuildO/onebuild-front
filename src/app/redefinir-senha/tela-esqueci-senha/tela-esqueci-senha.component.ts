import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/services/usuario.service';

@Component({
  selector: 'app-tela-esqueci-senha',
  templateUrl: './tela-esqueci-senha.component.html',
  styleUrls: ['./tela-esqueci-senha.component.css']
})
export class TelaEsqueciSenhaComponent implements OnInit {
  isLoading:boolean = false;
  isSubmited: boolean = false;
  successMessage:string | null = null;
  errorMessage:string | null = null;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
  }

  redirectToLogin(){
    this.router.navigate(['/login']);
  }

  formRecuperarSenha = this.formBuilder.group({
    email: new FormControl('', {validators: [Validators.required, Validators.email]}),
  });

  onSubmit(){
    this.isSubmited = true;
    this.isLoading = true;

    if(this.formRecuperarSenha.invalid){
      this.isLoading = false;
      return;
    }
    const email = this.formRecuperarSenha.value.email;
    this.usuarioService.enviarRecuperacaoSenha(email!).subscribe(
      (response) => {
        console.log("Email enviado com sucesso!");
        this.successMessage = "Email enviado com sucesso!";
        this.errorMessage = null;
      },
      (error) => {
        console.log(error);
        this.errorMessage = "Erro ao enviar email."
        this.successMessage = null;
      }
    );
    this.isLoading = false;
    this.isSubmited = false;
    return;
  }

}
