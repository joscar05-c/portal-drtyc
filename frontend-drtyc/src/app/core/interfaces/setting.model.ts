export interface Settings {
  institution_name?: string;
  director_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  facebook_url?: string;
  youtube_url?: string;
  [key: string]: string | undefined;
}
