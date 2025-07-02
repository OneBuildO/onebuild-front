import { StatusDoProjeto } from "./statusDoProjeto";

export interface ProjetoResumoDTO {
    id: number | null | undefined;
    idUsuario: string;
    observacoes: string;
    categoria: string;
    endereco: string;
    dataLimiteOrcamento: string; 
    publico: boolean;
    status: StatusDoProjeto;
    cidade: string;
    estado: string;
}
