import {
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/login/usuario';
import { LoginDTO } from 'src/app/sistema/LoginDTO';
import { DadosUsuario } from 'src/app/login/dadosUsuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = environment.apiURLBase + '/api/usuarios';
  tokenUrl: string = environment.apiURLBase + environment.tokenUrl;
  clientId: string = environment.clientId;
  clientSecret: string = environment.clientSecret;
  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {}

  obterToken() {
    return localStorage.getItem('access_token');
  }

  encerrarSessao() {
    localStorage.removeItem('access_token');
  }

  getUsuarioAutenticado(): Usuario | null {
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }

  obterPerfilUsuario(): Observable<DadosUsuario> {
    const token = this.obterToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.get<DadosUsuario>(`${this.apiUrl}/token`, { headers }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao obter perfil do usuário:', error);
        return throwError(
          'Erro ao obter perfil do usuário. Por favor, tente novamente.'
        );
      })
    );
  }

  getUserIdFromToken(): string | null {
    const token = this.obterToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.sub || null; //revisar isso aqui, não tem sub.
    }
    return null;
  }

  salvarUsuarioAutenticado(usuario: Usuario) {
    const token = this.obterToken();
    if (token) {
      const userId = this.getUserIdFromToken();
    }
  }

  getRoleUsuarioFromToken(): string | null {
    const token = this.obterToken();
    if (!token) return null;

    try {
      const decoded: any = this.jwtHelper.decodeToken(token);
      const authorities = decoded?.authorities;

      // Se vier um array e não estiver vazio, retorna a primeira role
      if (Array.isArray(authorities) && authorities.length > 0) {
        return authorities[0];
      }

      return null;
    } catch (e) {
      console.warn('Não foi possível decodificar o token para obter roles:', e);
      return null;
    }
  }

  getHomeRouteForRole(): string {
    const role = this.getRoleUsuarioFromToken();
    switch (role) {
      case 'ROLE_ADMIN':
        return '/usuario/dashboard-admin';
      case 'ROLE_ARQUITETO':
        return '/usuario/dashboard-arquiteto';
      case 'ROLE_CONSTRUTORA':
        return '/usuario/painel-construtora';
      case 'ROLE_DESIGN_INTERIORES':
        return '/usuario/painel-design';
      case 'ROLE_FORNECEDOR':
        return '/usuario/dashboard-fornecedor';
      case 'ROLE_CLIENTE':
        return '/usuario/dashboard-cliente';
      default:
        return '/forbidden';
    }
  }

  isAuthenticated(): boolean {
    const token = this.obterToken();
    if (token) {
      const expired = this.jwtHelper.isTokenExpired(token);

      return !expired;
    }
    return false;
  }

  login(loginDTO: LoginDTO): Observable<any> {
    const params = new HttpParams()
      .set('username', loginDTO.email)
      .set('password', loginDTO.senha)
      .set('grant_type', 'password');

    const headers = {
      Authorization: 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    return this.http.post(this.tokenUrl, params.toString(), { headers });
  }
}
