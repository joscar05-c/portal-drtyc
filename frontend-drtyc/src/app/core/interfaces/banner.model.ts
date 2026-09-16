export interface Banner {
  id: number;
  title: string;
  badge: string | null;
  description: string | null;
  button_text: string | null;
  button_icon: string | null;
  image_path: string;
  url: string | null;
}
