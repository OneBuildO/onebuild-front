export interface ClienteCadastroDTO {
  id?: string;
  nome: string;
  email: string;
  senha: string;
  confirmarSenha?: string;
  nomeProjeto: string;
  contato: string;
  cidade: string;
  estado: string;
}