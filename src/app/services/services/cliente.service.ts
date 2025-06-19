import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import { ClienteCadastroDTO } from 'src/app/sistema/servicos/cadastro-clientes/cliente-cadastro-dto';
import { Observable } from 'rxjs';

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
}
