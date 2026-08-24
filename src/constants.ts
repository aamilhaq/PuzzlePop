import type { DifficultyConfig, PuzzleImage } from './types';

export const DIFFICULTIES: DifficultyConfig[] = [
  { key: 'easy', label: 'Easy', size: 3, pieces: 9 },
  { key: 'medium', label: 'Medium', size: 4, pieces: 16 },
  { key: 'hard', label: 'Hard', size: 6, pieces: 36 },
];

const px = (id: string, size: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${size}&h=${size}`;

export const PUZZLE_IMAGES: PuzzleImage[] = [
  {
    id: 'mountain',
    name: 'Mountain',
    url: px('12385872', 900),
    thumb: px('12385872', 320),
    fallback: 'from-sky-400 via-emerald-400 to-indigo-500',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    url: px('14371170', 900),
    thumb: px('14371170', 320),
    fallback: 'from-cyan-400 via-blue-500 to-blue-700',
  },
  {
    id: 'forest',
    name: 'Forest',
    url: px('998723', 900),
    thumb: px('998723', 320),
    fallback: 'from-emerald-400 via-green-600 to-green-800',
  },
  {
    id: 'city',
    name: 'City',
    url: px('33112743', 900),
    thumb: px('33112743', 320),
    fallback: 'from-slate-700 via-indigo-800 to-black',
  },
  {
    id: 'space',
    name: 'Space',
    url: 'https://images.pexels.com/photos/32054508/pexels-photo-32054508.png?auto=compress&cs=tinysrgb&fit=crop&w=900&h=900',
    thumb: 'https://images.pexels.com/photos/32054508/pexels-photo-32054508.png?auto=compress&cs=tinysrgb&fit=crop&w=320&h=320',
    fallback: 'from-orange-500 via-rose-600 to-violet-900',
  },
  {
    id: 'animal',
    name: 'Animal',
    url: px('36375699', 900),
    thumb: px('36375699', 320),
    fallback: 'from-amber-300 via-orange-500 to-rose-600',
  },
];

export const ACCENT = {
  text: 'text-rose-500',
  bg: 'bg-rose-500',
  ring: 'ring-rose-400',
  border: 'border-rose-500',
  softBg: 'bg-rose-50',
  softText: 'text-rose-600',
};
