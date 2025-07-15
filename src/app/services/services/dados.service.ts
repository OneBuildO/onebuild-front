import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { ApiResponse } from './api-response-dto';
import { ArquivosProjetoDTO } from 'src/app/sistema/servicos/cadastro-projeto/arquivos-projetos-dto';

@Injectable({
  providedIn: 'root'
})
export class DadosService {
  private apiUrl = environment.apiURLBase + '/api/dados';

  constructor(private http: HttpClient) {}

  listarArquivosNormais(id: number): Observable<ApiResponse<ArquivosProjetoDTO[]>> {
    return this.http.get<ApiResponse<ArquivosProjetoDTO[]>>(`${this.apiUrl}/obter-arquivos/${id}`);
  }

  listarPlantasBaixas(id: number): Observable<ApiResponse<ArquivosProjetoDTO[]>> {
    return this.http.get<ApiResponse<ArquivosProjetoDTO[]>>(`${this.apiUrl}/obter-planta-baixa/${id}`);
  }

  downloadArquivo(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/arquivo/${id}`, {
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
}
