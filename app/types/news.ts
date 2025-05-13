export interface NewsItem {
  id: number;
  created_at: string;
  News: {
    title?: string;
    content?: string;
    age?: number;
    Name?: string;
    name?: string;
  } | null;
}