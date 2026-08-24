import { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { PuzzleGame } from './components/PuzzleGame';
import type { DifficultyConfig, PuzzleImage } from './types';

interface ActiveGame {
  image: PuzzleImage;
  difficulty: DifficultyConfig;
  customSrc?: string;
}

export default function App() {
  const [game, setGame] = useState<ActiveGame | null>(null);

  const handleStart = (
    image: PuzzleImage,
    difficulty: DifficultyConfig,
    customSrc?: string,
  ) => {
    setGame({ image, difficulty, customSrc });
  };

  const handleExit = () => setGame(null);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-neutral-50 to-neutral-100 text-neutral-900">
      {game ? (
        <PuzzleGame
          key={`${game.image.id}-${game.difficulty.key}`}
          image={game.image}
          difficulty={game.difficulty}
          customSrc={game.customSrc}
          onExit={handleExit}
        />
      ) : (
        <HomeScreen onStart={handleStart} />
      )}
    </div>
  );
}
