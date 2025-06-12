import { Permissao } from '../login/permissao';
import { TipoFornecedor } from '../login/tipoFornecedor';

export interface CadastroUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  permissaoDoUsuario: Permissao;
  tipoFornecedor?: TipoFornecedor;
  contato: string;
  cidade: string;
  estado: string;
  endereco: string;
  cnpj: string;
}
