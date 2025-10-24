import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

import { ApiResponse } from './api-response-dto';
import { ArquivosProjetoDTO } from 'src/app/sistema/servicos/cadastro-projeto/arquivos-projetos-dto';
import { TipoFornecedor } from 'src/app/login/tipoFornecedor';

@Injectable({
  providedIn: 'root'
})
export class DadosService {
  private apiUrl = environment.apiURLBase + '/api/dados';

  constructor(private http: HttpClient) { }

  listarArquivosNormais(id: number): Observable<ApiResponse<ArquivosProjetoDTO[]>> {
    return this.http.get<ApiResponse<ArquivosProjetoDTO[]>>(`${this.apiUrl}/obter-arquivos/${id}`);
  }

  listarPlantasBaixas(id: number): Observable<ApiResponse<ArquivosProjetoDTO[]>> {
    return this.http.get<ApiResponse<ArquivosProjetoDTO[]>>(`${this.apiUrl}/obter-planta-baixa/${id}`);
  }

  obterArquivosMaterialCompativel(idProjeto: number): Observable<ApiResponse<ArquivosProjetoDTO[]>> {
    const url = `${this.apiUrl}/obter-arquivos-material-compativel/${idProjeto}`;
    return this.http.get<ApiResponse<ArquivosProjetoDTO[]>>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar arquivos compatíveis:', error);
        return throwError(() => new Error('Erro ao buscar arquivos compatíveis.'));
      })
    );
  }

  downloadArquivo(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/arquivo/${id}/download`, {
      responseType: 'blob'
    });
  }

  downloadPlantaBaixa(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/planta-baixa/${id}`, {
      responseType: 'blob'
    });
  }

  excluirArquivo(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/deletar/${id}`);
  }

  adicionarArquivos(
    projetoId: number,
    arquivos: { file: File; categoria: TipoFornecedor }[]
  ): Observable<ApiResponse<string>> {
    const formData = new FormData();

    // múltiplos 'arquivos'
    for (const a of arquivos) {
      formData.append('arquivos', a.file);
    }

    // DTO com as categorias na mesma ordem dos arquivos
    const categorias = arquivos.map(a => a.categoria);
    formData.append(
      'categoriaArquivoDTO',
      new Blob([JSON.stringify({ categoriaArquivos: categorias })], { type: 'application/json' })
    );

    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/adicionar/${projetoId}`,
      formData
    );
  }

}
