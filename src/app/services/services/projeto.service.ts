import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

import { ApiResponse } from './api-response-dto';
import { ProjetoUsuarioDTO } from 'src/app/sistema/servicos/cadastro-projeto/projeto-usuario-dto';
import { ProjetoResumoDTO } from 'src/app/sistema/servicos/cadastro-projeto/projeto-resumo-dto';
import { ProjetosDisponiveisDTO } from 'src/app/sistema/servicos/cadastro-projeto/projetos-disponiveis-dto';
import { DetalheProjetoDTO } from 'src/app/sistema/servicos/cadastro-projeto/detalhe-projeto-dto';
import { ProjetoHistorico } from 'src/app/pages/projetos/models/ProjetoHistorico';

@Injectable({
  providedIn: 'root',
})
export class ProjetoService {
  apiUrl: string = environment.apiURLBase + '/api/projeto';

  constructor(private httpCliente: HttpClient) {}

  obterClientes(): Observable<ApiResponse<ProjetoUsuarioDTO[]>> {
    return this.httpCliente.get<ApiResponse<ProjetoUsuarioDTO[]>>(
      `${this.apiUrl}/obter-clientes`
    );
  }

  novoProjeto(
    novoProjetoDTO: ProjetoResumoDTO,
    arquivos: File[],
    plantaBaixaArquivos: File[]
  ): Observable<{ [key: string]: string }> {
    const formData = new FormData();

    arquivos.forEach((arquivo) => {
      formData.append('arquivos', arquivo);
    });

    plantaBaixaArquivos.forEach((arquivo) => {
      formData.append('plantaBaixaArquivos', arquivo);
    });

    const jsonBlob = new Blob([JSON.stringify(novoProjetoDTO)], {
      type: 'application/json',
    });

    formData.append('novoProjetoDTO', jsonBlob);

    return this.httpCliente.post<{ [key: string]: string }>(
      `${this.apiUrl}/novo-projeto`,
      formData
    );
  }

  getMeusProjetos(): Observable<ApiResponse<ProjetosDisponiveisDTO[]>> {
    return this.httpCliente.get<ApiResponse<ProjetosDisponiveisDTO[]>>(
      `${this.apiUrl}/meus-projetos`
    );
  }

  obterProjetos(): Observable<ApiResponse<ProjetosDisponiveisDTO[]>> {
    return this.httpCliente.get<ApiResponse<ProjetosDisponiveisDTO[]>>(
      `${this.apiUrl}/obter-projetos`
    );
  }

  obterProjeto(id: number): Observable<ApiResponse<ProjetoResumoDTO>> {
    return this.httpCliente.get<ApiResponse<ProjetoResumoDTO>>(
      `${this.apiUrl}/obter-projeto/${id}`
    );
  }

  obterProjetosParaTabela(): Observable<ProjetoHistorico[]> {
    const url = `${this.apiUrl}/historico-movimentacao`;
    return this.httpCliente.get<ProjetoHistorico[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar projetos para a nova tabela:', error);
        return throwError(() => new Error('Erro ao buscar dados da tabela.'));
      })
    );
  }

  buscarProjetosPorNome(
    nome: string
  ): Observable<ApiResponse<ProjetosDisponiveisDTO[]>> {
    const url = `${this.apiUrl}/search/${encodeURIComponent(nome)}`;
    return this.httpCliente
      .get<ApiResponse<ProjetosDisponiveisDTO[]>>(url)
      .pipe(
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

  buscarProjetosPorNomeLogado(
    nome: string
  ): Observable<ApiResponse<ProjetosDisponiveisDTO[]>> {
    const url = `${this.apiUrl}/search/me/${encodeURIComponent(nome)}`;
    return this.httpCliente
      .get<ApiResponse<ProjetosDisponiveisDTO[]>>(url)
      .pipe(
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

  atualizarProjeto(
    id: number,
    projetoAtualizadoDTO: ProjetoResumoDTO,
    novosArquivos: File[],
    novasPlantasBaixas: File[],
    removerArquivoIds: number[],
    removerPlantaBaixaIds: number[]
  ): Observable<ApiResponse<{ [key: string]: string }>> {
    const formData = new FormData();

    if (novosArquivos) {
      novosArquivos.forEach((file) => formData.append('novosArquivos', file));
    }

    if (novasPlantasBaixas) {
      novasPlantasBaixas.forEach((file) =>
        formData.append('novasPlantasBaixas', file)
      );
    }

    if (removerArquivoIds) {
      removerArquivoIds.forEach((id) =>
        formData.append('removerArquivoIds', id.toString())
      );
    }

    if (removerPlantaBaixaIds) {
      removerPlantaBaixaIds.forEach((id) =>
        formData.append('removerPlantaBaixaIds', id.toString())
      );
    }

    const jsonBlob = new Blob([JSON.stringify(projetoAtualizadoDTO)], {
      type: 'application/json',
    });
    formData.append('projetoAtualizadoDTO', jsonBlob);

    return this.httpCliente.put<ApiResponse<{ [key: string]: string }>>(
      `${this.apiUrl}/${id}`,
      formData
    );
  }

  obterDetalheProjeto(id: number): Observable<ApiResponse<DetalheProjetoDTO>> {
    return this.httpCliente.get<ApiResponse<DetalheProjetoDTO>>(
      `${this.apiUrl}/detalhe-projeto/${id}`
    );
  }

  deletarProjeto(
    id: number
  ): Observable<ApiResponse<{ [key: string]: string }>> {
    return this.httpCliente.delete<ApiResponse<{ [key: string]: string }>>(
      `${this.apiUrl}/${id}`
    );
  }
}
