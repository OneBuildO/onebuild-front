import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/login/usuario';
import { LoginDTO } from 'src/app/sistema/LoginDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  apiUrl: string = environment.apiURLBase + "/api/usuarios";
  tokenUrl: string = environment.apiURLBase + environment.tokenUrl;
  clientId: string = environment.clientId;
  clientSecret: string = environment.clientSecret;
  jwtHelper: JwtHelperService = new JwtHelperService();
  
  constructor(
    private http: HttpClient
  ) {}
  
  obterToken(){
    return localStorage.getItem('access_token');
  }

  encerrarSessao(){
    localStorage.removeItem('access_token')
  }

  getUsuarioAutenticado(): Usuario | null {
    const userJson = localStorage.getItem('usuario'); 
    if (userJson) {
        return JSON.parse(userJson);
    }
    return null; 
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

  isAuthenticated() : boolean {
    const token = this.obterToken();
    if(token){
      const expired = this.jwtHelper.isTokenExpired(token)

      return !expired;
    }
    return false;
  }

  login(loginDTO: LoginDTO) : Observable<any> {  const params = new HttpParams()
                        .set('username', loginDTO.email)
                        .set('password', loginDTO.senha)
                        .set('grant_type', 'password')


    const headers = {
      'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    return this.http.post( this.tokenUrl, params.toString(), { headers });
  }

}
