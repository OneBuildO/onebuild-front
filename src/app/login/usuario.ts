import { Projeto } from "../sistema/servicos/cadastro-projeto/projeto";
import { Permissao } from "./permissao";
import { TipoFornecedor } from "./tipoFornecedor";


export class Usuario {
  idUsuario!: string;
  nome!: string;
  email!: string;
  contato!: string;
  cidade!: string;
  estado!: string;
  endereco!: string;
  cnpj!: string;
  senha!: string;
  dataCadastro!: Date;
  fotoUsuario?: { documentoUrl: string; id: number; name: string } | null;
  tipoUsuario!: Permissao;
  tipoFornecedor?: TipoFornecedor;
  projeto!: Projeto;
}
