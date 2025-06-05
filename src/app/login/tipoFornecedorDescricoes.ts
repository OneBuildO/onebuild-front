import { TipoFornecedor } from "./tipoFornecedor";

export const TipoFornecedorDescricoes: Record<TipoFornecedor, string> = {
    [TipoFornecedor.VIDRACARIA]: 'Vidraçaria',
    [TipoFornecedor.MARMORARIA]: 'Marmoraria',
    [TipoFornecedor.ESQUADRIA]: 'Esquadria',
    [TipoFornecedor.AUTOMACAO]: 'Automação',
    [TipoFornecedor.MARCENARIA]: 'Marcenaria',
    [TipoFornecedor.MADEREIRA]: 'Madereira',
    [TipoFornecedor.ELETRICA]: 'Elétrica',
    [TipoFornecedor.CLIMATIZACAO]: 'Climatização',
    [TipoFornecedor.HIDRAULICA]: 'Hidráulica',
    [TipoFornecedor.GESSO]: 'Gesso',
    [TipoFornecedor.ILUMINACAO]: 'Iluminação',
    [TipoFornecedor.REVESTIMENTOS]: 'Revestimentos',
    [TipoFornecedor.FERRAGEM]: 'Ferragem',
    [TipoFornecedor.OUTROS]: 'Outros'
};