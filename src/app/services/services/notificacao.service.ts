import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notificacao } from 'src/app/sistema/servicos/notificacoes/Notificacao';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private baseUrl = environment.apiURLBase + "/api/notificacao";

  constructor(private http: HttpClient) {}

  obterNotificacoes() {
    return this.http.get<Notificacao[]>(this.baseUrl);
  }

  obterNotificacoesRecentes(){
    return this.http.get<Notificacao[]>(`${this.baseUrl}/recentes`);
  }

  marcarTodasComoLidas() {
    return this.http.put(`${this.baseUrl}/marcar-todas-como-lidas`, {});
  }

  marcarComoLida(id: number) {
    return this.http.put(`${this.baseUrl}/${id}/marcar-como-lida`, {});
  }



  

}
