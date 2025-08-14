import { TipoCompromisso } from "./tipo-compromisso";

export const TipoCompromissoDescricao: Record<TipoCompromisso, string> = {
    [TipoCompromisso.PESSOAL]: 'Pessoal',
    [TipoCompromisso.TRABALHO]: 'Trabalho',
    [TipoCompromisso.VIAGEM]: 'Viagem',
    [TipoCompromisso.SAUDE]: 'Saúde',
    [TipoCompromisso.ESTUDO]: 'Estudo',
    [TipoCompromisso.FERIAS]: 'Férias',
}