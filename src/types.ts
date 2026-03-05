export interface FileMetadata {
  id: string;
  created_at: string;
  name: string;
  size: number;
  type: string;
  url: string | null;
  user_id: string;
  path: string;
  is_folder: boolean;
  parent_id: string | null;
  content?: string;
}

export type Page = 'home' | 'about' | 'contact' | 'login' | 'signup' | 'dashboard' | 'reset-password';
