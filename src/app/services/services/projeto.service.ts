import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiResponse } from './api-response-dto';
import { Observable } from 'rxjs';
import { ProjetoUsuarioDTO } from 'src/app/sistema/servicos/cadastro-projeto/projeto-usuario-dto';
import { Projeto } from 'src/app/sistema/servicos/cadastro-projeto/projeto';

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {

  apiUrl: string = environment.apiURLBase + "/api/projeto"; 

  constructor(private httpCliente: HttpClient) { }

  obterClientes(): Observable<ApiResponse<ProjetoUsuarioDTO[]>> {
    return this.httpCliente.get<ApiResponse<ProjetoUsuarioDTO[]>>(`${this.apiUrl}/obter-clientes`);
  }

  novoProjeto(
    novoProjetoDTO: Projeto,
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

    formData.append('novoProjetoDTO', JSON.stringify(novoProjetoDTO));

    return this.httpCliente.post<{ [key: string]: string }>(
      `${this.apiUrl}/novo-projeto`,
      formData
    );
  }

}
