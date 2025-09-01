import { StatusProposta } from "./StatusProposta";


export const StatusPropostaDescricao: Record<StatusProposta, string> = {
    [StatusProposta.APROVADO]: 'Aprovado',
    [StatusProposta.EM_ANALISE]: 'Em análise',
    [StatusProposta.ENVIADO]: 'Enviado',
    [StatusProposta.NEGADO]: 'Negado',

};