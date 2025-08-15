import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ClienteCadastroDTO } from 'src/app/sistema/servicos/cadastro-clientes/cliente-cadastro-dto';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse } from './api-response-dto';
import { ClienteProjetoDTO } from 'src/app/sistema/servicos/visualizar-clientes/cliente-projeto-dto';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  apiUrl: string = environment.apiURLBase + "/api/cliente"; 

  constructor(private httpCliente: HttpClient) {}

  cadastrarCliente(cliente: ClienteCadastroDTO): Observable<any> {
    const url = `${this.apiUrl}/novo`;
    return this.httpCliente.post(url, cliente);
  }

  obterTodosClientes(): Observable<ApiResponse<ClienteCadastroDTO[]>> {
    const url = `${this.apiUrl}/obter-todos-clientes`;
    return this.httpCliente.get<ApiResponse<ClienteCadastroDTO[]>>(url);
  }

  buscarUsuariosPorNome(nome: string): Observable<ApiResponse<ClienteCadastroDTO[]>> {
    const url = `${this.apiUrl}/search-cliente/${encodeURIComponent(nome)}`;
    return this.httpCliente.get<ApiResponse<ClienteCadastroDTO[]>>(url).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erro ao buscar usuários por nome.';
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

  deleteClientById(id: string):Observable<void>{
      const url = `${this.apiUrl}/deletar/${id}`;
      return this.httpCliente.delete<void>(url).pipe(
      catchError((error) => {
        let errorMessage = 'Erro ao deletar cliente.';

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

  getClientById(id: string): Observable<ClienteProjetoDTO> {
    const url = `${this.apiUrl}/obter-cliente/${id}`;
    return this.httpCliente.get<ApiResponse<ClienteProjetoDTO>>(url).pipe(
      map((res) => res.response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar cliente.';

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

  atualizarCliente(id:string, clienteAtualizado:ClienteCadastroDTO): Observable<{message: string}>{
    const url = `${this.apiUrl}/atualizar/${id}`;
    return this.httpCliente.put<{message: string}>(url, clienteAtualizado).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao atualizar a loja.';

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

  obterClientesPorMes(ano:number): Observable<number[]> {
    const url = `${this.apiUrl}/dados/clientes-por-mes?ano=${ano}`;
    return this.httpCliente.get<ApiResponse<{ meses: number[] }>>(url).pipe(
      map(res => res.response.meses),
      catchError(this.handleError('Erro ao obter clientes por mês'))
    );
  }


  private handleError(message: string) {
    return (error: any) => {
      let errorMsg = message;
      if (error.error instanceof ErrorEvent) {
        errorMsg = `${message}: ${error.error.message}`;
      } else if (error.status) {
        errorMsg = `${message}: ${error.status} - ${error.message}`;
      }
      console.error(errorMsg);
      return throwError(() => new Error(errorMsg));
    };
  }
}
