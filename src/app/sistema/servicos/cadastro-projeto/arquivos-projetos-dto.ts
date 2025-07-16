export interface ArquivosProjetoDTO {
    id: number;
    nomeArquivo: string;
    arquivos?: string; 
    plantaBaixaArquivos?: string; 
    urlDownload: string;

    // novos campos opcionais para client-side(usado na listagem de arquivos do cliente)
    nomeProjeto?: string;
    dataUpload?: string;  // data de cadastro do projeto, ex.: "2025-07-16T14:30:00Z"
}
