import { Permissao } from "src/app/login/permissao";
import { TipoFornecedor } from "src/app/login/tipoFornecedor";


export interface AtualizarUsuarioDTO{
    id: number | null;
    nome: string | null;
    email: string | null;
    senha: string | null;
    confirmarSenha: string | null;
    permissaoDoUsuario: Permissao | null;
    tipoFornecedor?: TipoFornecedor | null;
    contato: string | null;
    cidade: string;
    estado: string;
    endereco: string;
    cnpj: string | null;
}