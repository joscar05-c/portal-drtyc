export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;
  image_path: string | null;
  category_id: number | null;
  published_at: string;
  category?: PostCategory;
}

export interface PostCategory {
  id: number;
  name: string;
  slug: string;
}
