import {Injectable} from '@angular/core';
import {environment} from "src/environments/environment";
import {HttpClient} from "@angular/common/http";
import {first} from "rxjs";
import { CadastroUsuarioDTO } from 'src/app/tela-cadastro/cadastroUsuarioDTO';
import {AuthService} from "./auth.service";
import { Usuario } from 'src/app/login/usuario';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly _apiBaseUrl = `${environment.apiUrl}`;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly authService : AuthService,
  ) {}



  saveUser(newUser : CadastroUsuarioDTO){
    return this.httpClient.post(`${this._apiBaseUrl}/usuario/novoUsuario`, newUser, {responseType: "text"})
      .pipe(first())
  }

  resendCodeValidationEmail(email: string){
    return this.httpClient.get(`${this._apiBaseUrl}/usuario/envioEmail/reenviarCodigoValidacaoEmail?email=${email}`,
      {responseType: "text"})
      .pipe(first())
  }




}
