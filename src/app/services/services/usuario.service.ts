import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { first, Observable, catchError, throwError } from "rxjs";
import { CadastroUsuarioDTO } from 'src/app/tela-cadastro/cadastroUsuarioDTO';
import { AuthService } from "./auth.service";
import { Usuario } from 'src/app/login/usuario';
import { AdminEstatisticaDTO } from 'src/app/sistema/dashboards/painel-admin/AdminEstatisticaDTO';
import { map } from 'rxjs/operators';
import { ClienteCadastroDTO } from 'src/app/sistema/servicos/cadastro-clientes/cliente-cadastro-dto';
import { ApiResponse } from './api-response-dto';
import { DadosUsuario } from 'src/app/login/dadosUsuario';
import { AtualizarUsuarioDTO } from 'src/app/sistema/meu-perfil/AtualizarUsuarioDTO';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  apiUrl: string = environment.apiURLBase + "/api/usuarios";

  private readonly _apiBaseUrl = `${environment.apiURLBase}`;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly authService: AuthService,
    private httpCliente: HttpClient
  ) { }


  getClientesDoUsuario(): Observable<ApiResponse<ClienteCadastroDTO[]>> {
    const url = `${this.apiUrl}/obter-clientes`;
    return this.httpClient.get<ApiResponse<ClienteCadastroDTO[]>>(url);
  }

  saveUser(newUser: CadastroUsuarioDTO) {
    return this.httpClient.post(`${this._apiBaseUrl}/api/usuarios/novo`, newUser, { responseType: "text" })
      .pipe(first())
  }

  updateUser(user: AtualizarUsuarioDTO) {
    return this.httpClient.put(`${this._apiBaseUrl}/api/usuarios/atualizar`, user, { responseType: "text" })
      .pipe(first())
  }

  resendCodeValidationEmail(email: string) {
    return this.httpClient.get(`${this._apiBaseUrl}/api/usuarios/envioEmail/reenviarCodigoValidacaoEmail?email=${email}`,
      { responseType: "text" })
      .pipe(first())
  }

  getUserLogged(): Observable<DadosUsuario> {
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

  enviarEmailSuporte(mensagem: string): Observable<any> {
    const url = `${this.apiUrl}/email/suporte`;
    const requestDTO = { mensagem };
    return this.httpCliente.post<any>(url, requestDTO).pipe(
      catchError((error) => {
        let errorMessage = 'Erro ao enviar e-mail para o suporte.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else if (error.status) {
          errorMessage = `Erro no servidor: ${error.status} - ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

}
