import { ArquivosProjetoDTO } from "./arquivos-projetos-dto";

export interface DetalheProjetoDTO {
  id: number;
  nomeCliente: string;
  nomeArquiteto: string;
  nomeProjeto: string;
  dataCadastro: string; 
  status: string;
  documentos: ArquivosProjetoDTO[];
}