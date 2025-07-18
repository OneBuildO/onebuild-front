import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Evento } from 'src/app/sistema/servicos/agenda-de-processos/evento';
import { ApiResponse } from './api-response-dto';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = environment.apiURLBase + '/api/eventos';
  
  constructor(private http:HttpClient) { }


  listarTodos(): Observable<ApiResponse<Evento[]>> {
    return this.http.get<ApiResponse<Evento[]>>(`${this.apiUrl}/obter-eventos`);
  }

  salvar(evento: Evento): Observable<ApiResponse<Evento>>{
    return this.http
      .post<ApiResponse<Evento>>(`${this.apiUrl}/novo-evento`, evento);
  }

}
