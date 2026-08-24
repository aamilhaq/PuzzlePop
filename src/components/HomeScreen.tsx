import { useMemo, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { ImageSelector } from './ImageSelector';
import { DifficultySelector } from './DifficultySelector';
import { DIFFICULTIES, PUZZLE_IMAGES } from '../constants';
import type { DifficultyConfig, PuzzleImage } from '../types';

interface HomeScreenProps {
  onStart: (image: PuzzleImage, difficulty: DifficultyConfig, customSrc?: string) => void;
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  const [selectedImage, setSelectedImage] = useState<PuzzleImage | null>(PUZZLE_IMAGES[0]);
  const [difficulty, setDifficulty] = useState<DifficultyConfig>(DIFFICULTIES[0]);
  const [customImage, setCustomImage] = useState<{ name: string; src: string } | null>(null);

  const images = useMemo(() => {
    if (!customImage) return PUZZLE_IMAGES;
    return [
      {
        id: 'custom',
        name: customImage.name || 'Uploaded',
        url: customImage.src,
        thumb: customImage.src,
        fallback: 'from-neutral-400 to-neutral-600',
      },
      ...PUZZLE_IMAGES,
    ];
  }, [customImage]);

  const handleUpload = (name: string, dataUrl: string) => {
    setCustomImage({ name, src: dataUrl });
  };

  const handleSelect = (img: PuzzleImage) => {
    setSelectedImage(img);
  };

  const canStart = selectedImage !== null;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col items-center px-4 py-8 sm:py-12">
      <div className="flex flex-col items-center text-center">
        <Logo size="lg" />
        <p className="mt-3 flex items-center gap-1.5 text-lg text-neutral-500">
          <Sparkles className="h-4 w-4 text-rose-400" />
          Piece it together.
        </p>
      </div>

      <div className="mt-10 w-full rounded-3xl border border-neutral-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-8">
          <ImageSelector
            images={images}
            selectedId={selectedImage?.id ?? null}
            onSelect={handleSelect}
            onUpload={handleUpload}
          />
          <DifficultySelector
            options={DIFFICULTIES}
            selected={difficulty.key}
            onSelect={setDifficulty}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            disabled={!canStart}
            onClick={() =>
              canStart &&
              onStart(
                selectedImage!,
                difficulty,
                selectedImage!.id === 'custom' ? selectedImage!.url : undefined,
              )
            }
            className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-rose-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
          >
            Start Puzzle
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-neutral-400">
        Drag pieces to their correct spots. They snap in place when you find the match.
      </p>
    </div>
  );
}
