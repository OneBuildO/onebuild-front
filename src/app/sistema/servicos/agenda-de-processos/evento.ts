export interface Evento {
  id?:         number;
  date:       string;    // "yyyy-MM-dd"
  time?:      string;
  title:      string;
  description?: string;
  color:      string;
  link?:      string;
}