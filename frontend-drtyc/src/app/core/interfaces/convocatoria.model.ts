export interface Convocatoria {
  id: number;
  titulo: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'Vigente' | 'Finalizada';
  bases_url: string;
}
