import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RespostaNovidadeRequestDTO } from 'src/app/pages/novidades/models/RespostaNovidadeRequestDTO';
import { RespostasNovidadeResponseDTO } from 'src/app/pages/novidades/models/RespostasNovidadeResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class RespostasNovidadeService {
  private apiURL = `${environment.apiURLBase}/api/respostas`;

  constructor(private http: HttpClient) {}

  responderNovidade(dto: RespostaNovidadeRequestDTO): Observable<void> {
    return this.http
      .post<void>(`${this.apiURL}/cadastrar`, dto, {
        responseType: 'text' as 'json',
      })
      .pipe(catchError(this.handleError('cadastrar a resposta à novidade')));
  }

  getRespostasPorNovidadeECliente(
    novidadeId: string,
    clienteId: string
  ): Observable<RespostasNovidadeResponseDTO[]> {
    const url = `${this.apiURL}/novidade/${novidadeId}/cliente/${clienteId}`;
    return this.http
      .get<RespostasNovidadeResponseDTO[]>(url)
      .pipe(catchError(this.handleError('buscar respostas da novidade')));
  }

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
