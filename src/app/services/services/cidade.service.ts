import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';


interface Estado {
  nome: string;
  sigla : string;
}

export const listaEstados : Estado[] = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

@Injectable({ providedIn: 'root' })
export class CidadesService {

  private readonly _apiBaseUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades';

  constructor(
    private readonly http: HttpClient
  ) {}

  getCidadesByEstado(estadoId: string): Observable<any[]> {
    const url = `${this._apiBaseUrl}/estados/${estadoId}/municipios`;
    return this.http.get<any[]>(url).pipe(
      catchError(error => {
        console.error('Erro ao buscar cidades', error);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
  }

  getCidadesByNomeEstado(estadoNome: string): Observable<any[]> {
    const url = `${this._apiBaseUrl}/estados`;
    return this.http.get<any[]>(url).pipe(
      map(estados => estados.find(estado => estado.nome.toLowerCase() === estadoNome.toLowerCase())),
      switchMap(estado => {
        if (estado && estado.id) {
          return this.getCidadesByEstado(estado.id);
        } else {
          console.error('Estado não encontrado');
          return of([]); // Retorna um array vazio se o estado não for encontrado
        }
      }),
      catchError(error => {
        console.error('Erro ao buscar estado', error);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
  }
}