import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Notificacao } from 'src/app/sistema/servicos/notificacoes/Notificacao';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private baseUrl = environment.apiURLBase + "/api/notificacao";

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();
  
  constructor(private http: HttpClient) {}

  obterNotificacoes() {
    return this.http.get<Notificacao[]>(this.baseUrl).pipe(
      tap((notifications: Notificacao[]) => {
        const unreadCount = notifications.filter(notification => !notification.lida).length;
        this.unreadCountSubject.next(unreadCount);
      })
    );
  }

  obterNotificacoesRecentes(){
    return this.http.get<Notificacao[]>(`${this.baseUrl}/recentes`);
  }

  marcarTodasComoLidas() {
    return this.http.put(`${this.baseUrl}/marcar-todas-como-lidas`, {})
    .pipe(
      tap(() => {
        this.unreadCountSubject.next(0);
      })
    );
  }

  marcarComoLida(id: number) {
    return this.http.put(`${this.baseUrl}/${id}/marcar-como-lida`, {}).pipe(
      tap(() => {
        const current = this.unreadCountSubject.value;
        if (current > 0) {
          this.unreadCountSubject.next(current - 1);
        }
      })
    );
  }

  atualizarContadorNaoLidas(count: number): void {
    this.unreadCountSubject.next(count);
  }



  

}
