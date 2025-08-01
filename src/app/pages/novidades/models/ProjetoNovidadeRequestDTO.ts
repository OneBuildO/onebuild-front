export interface ProjetoNovidadeRequestDTO {
  clienteId: string;
  projetoId: number;
  titulo: string;
  descricao: string;
  statusDaObra: string;
  imagem?: File;
}
