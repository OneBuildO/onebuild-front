import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PropostaDTO } from 'src/app/pages/proposta-fornecedor/models/propostaDTO';
import { catchError, map, Observable, throwError } from 'rxjs';
import { error } from 'console';
import { PropostasFornecedorDTO } from 'src/app/pages/proposta-fornecedor/models/propostasFornecedorDTO';
import { PropostaFornecedorCard } from 'src/app/pages/proposta-fornecedor/models/propostaProjetoCardDTO';
import { AcaoPropostaRequestDTO } from 'src/app/pages/proposta-fornecedor/models/acaoPropostaRequestDTO';

@Injectable({
    providedIn: 'root',
})
export class PropostaFornecedorService {
    private apiURL = `${environment.apiURLBase}/api/propostas-fornecedores`;

    constructor(private http: HttpClient) { }

    enviarProposta(dados: PropostaDTO): Observable<{ message: string }> {
        const formData = new FormData();
        formData.append(
            'propostaDTO',
            JSON.stringify({
                valorDaProposta: dados.valorDaProposta,
                fornecedorId: dados.fornecedorId,
                projetoId: dados.projetoId
            })
        );

        if (dados.arquivo) {
            formData.append('anexoArquivo', dados.arquivo);
        }

        return this.http
            .post<{ message: string }>(`${this.apiURL}/`, formData)
            .pipe(
                catchError(this.handleError('Enviar a proposta'))
            );
    }

    obterPropostasFornecedor() {
        const url = `${this.apiURL}/fornecedor/`;
        return this.http.get<{ data: PropostasFornecedorDTO[] }>(url).pipe(
            map(response => response.data)
        );
    }

    obterPropostasProjeto(idProjeto: number): Observable<PropostaFornecedorCard[]> {
        const url = `${this.apiURL}/projeto/${encodeURIComponent(idProjeto)}`;
        return this.http.get<{ data: PropostaFornecedorCard[] }>(url).pipe(
            map(response => response.data)
        );
    }

    aceitarProposta(acao: AcaoPropostaRequestDTO): Observable<any> {
        const url = `${this.apiURL}/${acao.id}/aceitar`;
        return this.http.post(url, acao);
    }

    negarProposta(acao: AcaoPropostaRequestDTO): Observable<any> {
        const url = `${this.apiURL}/${acao.id}/negar`;
        return this.http.post(url, acao);
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
