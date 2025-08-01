import { Prioridade } from "./prioridade";
import { ClienteProjetoDTO } from '../visualizar-clientes/cliente-projeto-dto';
import { Status } from "./status";
import { ProjetoResumoDTO } from "../cadastro-projeto/projeto-resumo-dto";

export class Atividade {
  id?: string;
  nome!: string;
  descricao!: string;
  //cliente?: ClienteProjetoDTO;
  projeto?: number;
  dataDeInicio?: string;
  dataDeEntrega!: string;
  prioridade!: Prioridade;
  status?: Status;
}