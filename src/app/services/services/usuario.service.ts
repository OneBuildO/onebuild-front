import {Injectable} from '@angular/core';
import {environment} from "src/environments/environment";
import {HttpClient} from "@angular/common/http";
import {first, Observable} from "rxjs";
import { CadastroUsuarioDTO } from 'src/app/tela-cadastro/cadastroUsuarioDTO';
import {AuthService} from "./auth.service";
import { Usuario } from 'src/app/login/usuario';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdminEstatisticaDTO } from 'src/app/sistema/dashboards/painel-admin/AdminEstatisticaDTO';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly _apiBaseUrl = `${environment.apiURLBase}`;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly authService : AuthService,
  ) {}


  saveUser(newUser : CadastroUsuarioDTO){
    return this.httpClient.post(`${this._apiBaseUrl}/api/usuarios/novo`, newUser, {responseType: "text"})
      .pipe(first())
  }

  resendCodeValidationEmail(email: string){
    return this.httpClient.get(`${this._apiBaseUrl}/api/usuarios/envioEmail/reenviarCodigoValidacaoEmail?email=${email}`,
      {responseType: "text"})
      .pipe(first())
  }

  getUserLogged(): Observable<Usuario>{
    return this.authService.obterPerfilUsuario();
  }

  getDadosEstatisticasAdmin(): Observable<AdminEstatisticaDTO> {
    return this.httpClient
      // <-- usamos any aqui pra não precisar declarar ApiResponse<T> no front
      .get<any>(`${this._apiBaseUrl}/api/usuarios/obter-dados-estatistica-usuario-admin`)
      .pipe(
        // descarta tudo menos o campo .response
        map(data => data.response as AdminEstatisticaDTO),
      );
  }

}
