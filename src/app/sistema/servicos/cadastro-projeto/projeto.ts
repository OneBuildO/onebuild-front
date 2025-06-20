import { StatusDoProjeto } from "./statusDoProjeto";

export interface Projeto {
  idUsuario: string;
  observacoes: string;
  categoria: string;
  endereco: string;
  dataLimiteOrcamento: string; 
  publico: boolean;
  status: StatusDoProjeto;
  cidade: string;
  estado: string;
}
