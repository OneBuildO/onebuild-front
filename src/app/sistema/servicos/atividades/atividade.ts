import { Prioridade } from "./prioridade";
import { ClienteProjetoDTO } from '../visualizar-clientes/cliente-projeto-dto';
import { Status } from "./status";
import { ProjetoResumoDTO } from "../cadastro-projeto/projeto-resumo-dto";

export class Atividade {
  id?: string;
  nome!: string;
  descricao!: string;
  clienteId?: number;
  projetoId?: number;
  dataDeInicio?: string;
  dataDeEntrega!: string;
  prioridade!: Prioridade;
  status?: Status;
}