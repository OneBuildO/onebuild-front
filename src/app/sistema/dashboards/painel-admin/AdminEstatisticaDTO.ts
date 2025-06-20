import { TipoFornecedor } from "src/app/login/tipoFornecedor";

export interface AdminEstatisticaDTO{
    numArquitetos:number;
    numTotalConstrutoras:number;
    numTotalDesigninteriores:number;
    numTotalFornecedores:number;

    //gráficos
    numFornecedoresPorSegmento: Record<TipoFornecedor, number>;
    projetosPorCidade:number;
}