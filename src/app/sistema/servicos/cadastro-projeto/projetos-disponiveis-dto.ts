import { StatusDoProjeto } from "./statusDoProjeto";

export interface ProjetosDisponiveisDTO {
  idProjeto: number;
  nomeProjeto: string;    // nome do projeto
  cliente: string;
  nomeArquiteto: string;
  status: string;
  dataCadastro: string;      // ISO string
  cidade: string;
  estado: string;
}
