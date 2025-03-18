export interface Song {
  content: string;
  language: string;
  theme: string;
  mood: string;
}

export interface Language {
  value: string;
  label: string;
}

export interface Mood {
  value: string;
  label: string;
  color: string;
}