import { Permissao } from '../login/permissao';
import { TipoFornecedor } from '../login/tipoFornecedor';

export interface CadastroUsuarioDTO {
  nome: string | null;
  email: string | null;
  senha: string | null;
  //confirmarSenha: string | null;
  permissaoDoUsuario: Permissao | null;
  tipoFornecedor?: TipoFornecedor | null;
  contato: string | null;
  cidade: string;
  estado: string;
  endereco: string;
  cnpj: string | null;
}
