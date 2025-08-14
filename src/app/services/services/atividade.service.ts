import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Atividade } from 'src/app/sistema/servicos/atividades/atividade';
import { Status } from 'src/app/sistema/servicos/atividades/status';
import { ApiResponse } from './api-response-dto';

@Injectable({
  providedIn: 'root',
})
export class AtividadeService {
  private apiURL = `${environment.apiURLBase}/api/atividade`;

  constructor(private http: HttpClient) {}

  /** Cadastra nova atividade */
  cadastrarAtividade(atividade: Atividade): Observable<Atividade> {
    return this.http.post<ApiResponse<Atividade>>(this.apiURL, atividade).pipe(
      map(res => res.response),
      catchError(this.handleError('cadastrar a atividade'))
    );
  }

  /** Retorna todas as atividades */
  getAtividades(): Observable<Atividade[]> {
    return this.http
      .get<Atividade[]>(this.apiURL)
      .pipe(catchError(this.handleError('buscar as atividades')));
  }

  /** Retorna as atividades de um dado cliente + projeto */
  getAtividadesByProjeto(projetoId: number | string): Observable<Atividade[]> {
    return this.http
      .get<ApiResponse<Atividade[]>>(`${this.apiURL}/projeto/${projetoId}`)
      .pipe(
        map(apiRes => apiRes.response),      
        catchError(this.handleError('buscar atividades por projeto')));
  }


  getAtividadesByProjetoECliente(
    projetoId: number | string,
    clienteId: number | string
  ): Observable<Atividade[]> {
    const params = new HttpParams()
      .set('projetoId', String(projetoId))
      .set('clienteId', String(clienteId));

    return this.http
      .get<ApiResponse<Atividade[]>>(this.apiURL, { params })
      .pipe(
        map(apiRes => apiRes.response),
        catchError(this.handleError('buscar atividades por projeto e cliente'))
      );
  }

  /** Atualiza o status de uma atividade */
  atualizarStatusAtividade(
    id: number | string,
    status: Status
  ): Observable<Atividade> {
    const url = `${this.apiURL}/${id}/${status}`;
    return this.http
      .put<ApiResponse<Atividade>>(url,null)
      .pipe(
        map(res => res.response),
        catchError(this.handleError('atualizar o status da atividade')));
  }

  atualizarAtividade(id:number | string, atividade: Atividade): Observable<Atividade> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<ApiResponse<Atividade>>(url, atividade).pipe(
      map(res => res.response),
      catchError(this.handleError('atualizar a atividade'))
    );
  }


  deletarAtividade(id: number | string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete<ApiResponse<void>>(url).pipe(
      map(res => res.response),
      catchError(this.handleError('deletar a atividade'))
    );
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
