import { StatusDoProjeto } from "./statusDoProjeto";

export const StatusDoProjetoDescricoes: Record<StatusDoProjeto, string> = {
    [StatusDoProjeto.NOVO_PROJETO]: 'Novo Projeto',
    [StatusDoProjeto.EM_COTACAO]: 'Em Cotação',
    [StatusDoProjeto.EM_ANDAMENTO]: 'Em Andamento',
    [StatusDoProjeto.FINALIZADO]: 'Finalizado',
};