export interface JobPosting {
  id: number;
  title: string;
  description: string | null;
  bases_pdf_path: string;
  start_date: string;
  end_date: string;
  status: 'vigente' | 'evaluacion' | 'finalizada';
  created_at: string;
}
