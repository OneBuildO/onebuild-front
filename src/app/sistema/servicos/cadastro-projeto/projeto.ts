import { StatusDoProjeto } from "./statusDoProjeto";


export class Projeto {
  id!: number;
  categoria!: string;
  statusDoProjeto!: StatusDoProjeto;
  dataCadastro!: Date;
}
