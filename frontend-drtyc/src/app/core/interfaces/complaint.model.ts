export interface Complaint {
  document_number: string;
  full_name: string;
  email: string;
  phone: string;
  type: 'queja' | 'reclamo';
  details: string;
}

export interface ComplaintResponse {
  message: string;
  tracking_id: number;
}
