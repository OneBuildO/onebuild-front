import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {first} from "rxjs";
import {AuthService} from "./auth.service";
import { ClienteResumoDTO } from 'src/app/sistema/servicos/cadastro-clientes/cliente-resumo-dto';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor() { }
}
