export interface DocumentItem {
  id: number;
  title: string;
  document_type: string;
  document_number: string;
  year: number;
  file_path: string;
  category_id: number | null;
  created_at: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}
