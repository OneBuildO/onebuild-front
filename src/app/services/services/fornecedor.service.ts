import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { map } from 'rxjs/operators';
import { Fornecedor } from 'src/app/pages/fornecedor/models/Fornecedor';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FornecedorService {
    apiUrl: string = environment.apiURLBase + "/api/fornecedor";

    private readonly _apiBaseUrl = `${environment.apiURLBase}`;

    constructor(
        private readonly httpClient: HttpClient,
        private readonly authService: AuthService,
    ) { }


    getFornecedores(): Observable<Fornecedor[]> {
        return this.httpClient.get<{ data: Fornecedor[] }>(this.apiUrl).pipe(
            map(response => response.data)
        );
    }

    getFornecedoresPorCidade(cidade: string): Observable<Fornecedor[]> {
        const url = `${this.apiUrl}/${encodeURIComponent(cidade)}`;
        return this.httpClient.get<{ data: Fornecedor[] }>(url).pipe(
            map(response => response.data)
        );
    }

}
