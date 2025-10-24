import { TipoFornecedor } from "src/app/login/tipoFornecedor";

export interface PropostaFornecedorCard {
    id: number;
    urlFoto: string;
    razaoSocial: string;
    classificacao: number;
    descricaoFornecedor: string;
    categoria: TipoFornecedor;
    valorProposta: number;
    propostaUrl: string; 
    key: string;
}