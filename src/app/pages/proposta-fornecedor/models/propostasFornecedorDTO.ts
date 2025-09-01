export interface PropostasFornecedorDTO {
    id: number;
    razaoSocial: string;
    nomeProjeto: string;
    valorDaProposta: number;
    statusProposta: string;
    propostaUrl: string;
    key: string;
    tipoArquivo: string;
    fornecedorId: number;
    projetoId: number;
}