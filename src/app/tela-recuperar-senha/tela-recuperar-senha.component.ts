import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tela-recuperar-senha',
  templateUrl: './tela-recuperar-senha.component.html',
  styleUrls: ['./tela-recuperar-senha.component.css']
})
export class TelaRecuperarSenhaComponent implements OnInit {
  isLoading:boolean = false;
  isSubmited: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
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

    this.isLoading = false;
    this.isSubmited = false;
    return;
  }


}
