export interface AtividadeDTO {
  id: string;
  name: string;
  resource?: string;
  start: string;       // ISO date string
  end: string;         // ISO date string
  percentComplete: number;
  dependencies?: string;
}
