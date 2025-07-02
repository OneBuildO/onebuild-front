import { StatusDoProjeto } from "./statusDoProjeto";

export interface ProjetosDisponiveisDTO {
    idProjeto: number,
    cliente: string;
    projetoCliente: string;
    status: StatusDoProjeto;
    cidade: string;
    estado: string;
}
