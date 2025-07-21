import { Prioridade } from "./prioridade";
import { ClienteProjetoDTO } from '../visualizar-clientes/cliente-projeto-dto';
import { Status } from "./status";

export class Atividade {
  id?: string;
  nome!: string;
  descricao!: string;
  cliente?: ClienteProjetoDTO;
  dataDeInicio?: string;
  dateDaEntrega!: string;
  prioridade!: Prioridade;
  status?: Status;
}