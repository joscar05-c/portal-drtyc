export interface QuickLink {
  id: number;
  title: string;
  description: string | null;
  url: string;
  icon: string | null;
  icon_path: string | null;
  badge_text: string | null;
  badge_color: string;
  footer_info: string | null;
  button_text: string | null;
  button_icon: string | null;
  sort_order: number;
  is_active: boolean;
}
