import { ProjetoDTO } from "./projeto-dto";

export interface ClienteProjetoDTO {
    id: string;
    nome: string;
    email: string;
    senha: string | null;
    confirmarSenha: string | null;
    idUsuario: number;
    tipoFornecedor: string | null;
    permissaoDoUsuario: string;
    contato: string;
    cidade: string;
    estado: string;
    endereco: string | null;
    cnpj: string | null;
    projetoCliente: string | null;
    projetos: ProjetoDTO[];
}