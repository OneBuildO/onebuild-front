import { Permissao } from '../login/permissao';
import { TipoFornecedor } from '../login/tipoFornecedor';

export interface CadastroUsuarioDTO {
  nome: string;
  permissaoDoUsuario: Permissao;
  tipoFornecedor?: TipoFornecedor;
  email: string;
  contato: string;
  cnpj: string;
  senha: string;
  estado: string;
  cidade: string;
  endereco: string;
}
