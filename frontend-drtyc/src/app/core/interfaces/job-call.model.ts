export interface JobCallDocument {
  document_name: string;
  file_path: string;
  published_at: string;
}

export interface JobCallSchedule {
  stage: string;
  date_range: string;
}

export interface JobCall {
  id: number;
  title: string;
  slug: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  application_start_at: string | null;
  application_end_at: string | null;
  description: string | null;
  documents: JobCallDocument[] | null;
  schedule: JobCallSchedule[] | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationStatusResult {
  found: boolean;
  status?: string;
  updated_at?: string;
  message?: string;
}
