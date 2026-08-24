export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  key: Difficulty;
  label: string;
  size: number;
  pieces: number;
}

export interface PuzzleImage {
  id: string;
  name: string;
  url: string;
  thumb: string;
  /** Tailwind gradient used as a fallback if the image fails to load. */
  fallback: string;
}

export type GameScreen = 'home' | 'playing';

export interface GameSetup {
  image: PuzzleImage;
  difficulty: DifficultyConfig;
  /** A data URL for an uploaded image, used instead of `image.url` when present. */
  customSrc?: string;
}
