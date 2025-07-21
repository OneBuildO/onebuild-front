import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Atividade } from 'src/app/sistema/servicos/atividades/atividade';
import { Status } from 'src/app/sistema/servicos/atividades/status';

@Injectable({
  providedIn: 'root',
})
export class AtividadeService {
  private apiURL = `${environment.apiURLBase}/api/atividade`;

  constructor(private http: HttpClient) {}

  /** Cadastra nova atividade */
  cadastrarAtividade(atividade: Atividade): Observable<Atividade> {
    return this.http.post<Atividade>(this.apiURL, atividade).pipe(
      catchError(this.handleError('cadastrar a atividade'))
    );
  }

  /** Retorna todas as atividades */
  getAtividades(): Observable<Atividade[]> {
    return this.http.get<Atividade[]>(this.apiURL).pipe(
      catchError(this.handleError('buscar as atividades'))
    );
  }

  /** Retorna as atividades de um dado cliente + projeto */
  getAtividadesByProjeto(
    clienteId: number | string,
    projetoId: number | string
  ): Observable<Atividade[]> {
    const params = {
      clienteId: clienteId.toString(),
      projetoId: projetoId.toString(),
    };
    return this.http
      .get<Atividade[]>(`${this.apiURL}/por-projeto`, { params })
      .pipe(catchError(this.handleError('buscar atividades por projeto')));
  }

  /** Atualiza o status de uma atividade */
  atualizarStatusAtividade(
    id: number | string,
    status: Status
  ): Observable<void> {
    const url = `${this.apiURL}/${id}/status`;
    // envia { status: 'EM_PROGRESSO' } ao back-end
    return this.http
      .put<void>(
        url,
        { status },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .pipe(catchError(this.handleError('atualizar o status da atividade')));
  }

  /** Tratamento genérico de erros */
  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      let msg = `Erro ao ${operation}.`;
      if (error.error instanceof ErrorEvent) {
        msg = `Erro de rede ao ${operation}: ${error.error.message}`;
      } else if (error.status) {
        msg = `Erro no servidor ao ${operation}: ${error.status} — ${error.message}`;
      }
      console.error(msg);
      return throwError(() => new Error(msg));
    };
  }
}
