export interface Fornecedor {
    id: number;
    nome: string;
    email: string;
    senha: string | null;
    confirmarSenha: string | null;
    idUsuario: number;
    tipoFornecedor: string;
    permissaoDoUsuario: string;
    avatarUrl: string | null;
    descricaoFornecedor: string | null;
    contato: string;
    cidade: string;
    estado: string;
    endereco: string;
    cep: string | null;
    rua: string | null;
    numeroEndereco: string | null;
    bairro: string | null;
    cnpj: string;
    ativo: boolean;
    classificacao: number;
}
