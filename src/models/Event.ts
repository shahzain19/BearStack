// src/types/Event.ts
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  cover_image: string | null;
  created_at: string;
  created_by: string;
}
