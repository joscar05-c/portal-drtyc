export interface DocumentMovementItem {
  from_area: string;
  from_user: string;
  to_area: string;
  to_user: string | null;
  action_requested: string;
  observations: string | null;
  is_received: boolean;
  received_at: string | null;
  date: string;
}

export interface DocumentEntryTrack {
  tracking_number: string;
  document_type: string;
  subject: string;
  sender_name: string;
  status: string;
  registered_at: string;
  movements: DocumentMovementItem[];
}
