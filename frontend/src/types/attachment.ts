export interface Attachment {
  id: string;
  product_id: string;
  field_key: string;
  alias?: string | null;
  drive_file_id: string;
  file_name: string;
  mime_type?: string | null;
  url?: string | null;
  uploaded_at: string;
}
