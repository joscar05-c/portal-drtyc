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
  tracking_code: string;
}

export interface ComplaintTrackRequest {
  tracking_code: string;
  document_number: string;
}

export interface ComplaintTrackResult {
  tracking_code: string;
  status: string;
  status_label: string;
  type: string;
  type_label: string;
  registered_at: string;
  details: string;
  citizen_response: string | null;
}
