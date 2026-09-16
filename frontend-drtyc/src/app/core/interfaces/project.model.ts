export interface Project {
  id: number;
  title: string;
  location: string;
  budget: number;
  progress_percentage: number;
  status: 'planeamiento' | 'en_ejecucion' | 'paralizada' | 'culminada';
  image_path: string | null;
  created_at: string;
}
