import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ProjetoNovidadeRequestDTO } from 'src/app/pages/novidades/models/ProjetoNovidadeRequestDTO';
import { ProjetoNovidadeResponseDTO } from 'src/app/pages/novidades/models/ProjetoNovidadeResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class NovidadesService {
  private apiURL = `${environment.apiURLBase}/api/novidade`;

  constructor(private http: HttpClient) {}

  cadastrarNovidade(dados: ProjetoNovidadeRequestDTO): Observable<any> {
    const formData = new FormData();
    formData.append(
      'dados',
      JSON.stringify({
        clienteId: dados.clienteId,
        projetoId: dados.projetoId,
        titulo: dados.titulo,
        descricao: dados.descricao,
        statusDaObra: dados.statusDaObra,
      })
    );

    if (dados.imagem) {
      formData.append('imagem', dados.imagem);
    }

    return this.http
      .post(`${this.apiURL}/cadastrar`, formData, { responseType: 'text' })
      .pipe(catchError(this.handleError('cadastrar a novidade')));
  }

  getNovidadesPorProjetoECliente(
    projetoId: number,
    clienteId: string
  ): Observable<ProjetoNovidadeResponseDTO[]> {
    const url = `${this.apiURL}/projeto/${projetoId}/cliente/${clienteId}`;
    return this.http
      .get<ProjetoNovidadeResponseDTO[]>(url)
      .pipe(catchError(this.handleError('buscar novidades do projeto')));
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
