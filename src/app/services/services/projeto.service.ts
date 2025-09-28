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
import { TipoFornecedor } from 'src/app/login/tipoFornecedor';

@Injectable({
  providedIn: 'root',
})
export class ProjetoService {
  apiUrl: string = environment.apiURLBase + '/api/projeto';

  constructor(private httpCliente: HttpClient) { }

  obterClientes(): Observable<ApiResponse<ProjetoUsuarioDTO[]>> {
    return this.httpCliente.get<ApiResponse<ProjetoUsuarioDTO[]>>(
      `${this.apiUrl}/obter-clientes`
    );
  }

  novoProjeto(
    novoProjetoDTO: ProjetoResumoDTO,
    arquivos: File[],
    categorias: TipoFornecedor[]
  ): Observable<{ [key: string]: string }> {
    const formData = new FormData();

    arquivos.forEach((arquivo) => {
      formData.append('arquivos', arquivo);
    });


    const jsonBlob = new Blob([JSON.stringify(novoProjetoDTO)], {
      type: 'application/json',
    });

    formData.append('novoProjetoDTO', jsonBlob);

    const categoriasPayload = { categoriaArquivos: categorias };
    const categoriasBlob = new Blob([JSON.stringify(categoriasPayload)], {
      type: 'application/json',
    });
    formData.append('categoriaArquivoDTO', categoriasBlob);

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

  obterProjetosPorStatus(): Observable<Record<string, number>> {
    const url = `${this.apiUrl}/dados/projetos-por-status`;
    return this.httpCliente.get<ApiResponse<Record<string, number>>>(url).pipe(
      map(res => res.response ?? {}),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar projetos pelos status:', error);
        return throwError(() => new Error('Erro ao buscar projetos pelos status.'));
      })
    );
  }

  obterProjetosPorMes(ano: number): Observable<number[]> {
    const url = `${this.apiUrl}/dados/projetos-por-mes?ano=${ano}`;
    return this.httpCliente.get<ApiResponse<{ meses: number[] }>>(url).pipe(
      map(res => res.response.meses),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar projetos por mes:', error);
        return throwError(() => new Error('Erro ao buscar projetos por mes.'));
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


  buscarProjetosPorCliente(
    nome: string
  ): Observable<ApiResponse<ProjetosDisponiveisDTO[]>> {
    const url = `${this.apiUrl}/search/cliente/${encodeURIComponent(nome)}`;
    return this.httpCliente
      .get<ApiResponse<ProjetosDisponiveisDTO[]>>(url)
      .pipe(
        map((response) => response),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Erro ao buscar projetos por nome do cliente.';
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

  obterProjetoPublicoPorEstado(estado: string): Observable<ApiResponse<ProjetosDisponiveisDTO[]>> {
    const url = `${this.apiUrl}/obter-projetos/${encodeURIComponent(estado)}`;
    return this.httpCliente.get<ApiResponse<ProjetosDisponiveisDTO[]>>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar projetos públicos por estado:', error);
        return throwError(() => new Error('Erro ao buscar projetos públicos por estado.'));
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
    categorias: TipoFornecedor[],              // <-- NOVO
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


    const categoriasPayload = { categoriaArquivos: categorias };
    const categoriasBlob = new Blob([JSON.stringify(categoriasPayload)], {
      type: 'application/json',
    });
    formData.append('categoriaArquivoDTO', categoriasBlob);   // <-- NOVO

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
