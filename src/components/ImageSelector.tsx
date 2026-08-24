import { useRef } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import type { PuzzleImage } from '../types';
import { ACCENT } from '../constants';

interface ImageSelectorProps {
  images: PuzzleImage[];
  selectedId: string | null;
  onSelect: (image: PuzzleImage) => void;
  onUpload: (name: string, dataUrl: string) => void;
}

export function ImageSelector({
  images,
  selectedId,
  onSelect,
  onUpload,
}: ImageSelectorProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpload(file.name.replace(/\.[^.]+$/, ''), String(reader.result));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
        <ImageIcon className="h-4 w-4" />
        Choose your image
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => {
          const active = img.id === selectedId;
          return (
            <button
              key={img.id}
              type="button"
              onClick={() => onSelect(img)}
              className={`group relative aspect-square overflow-hidden rounded-2xl border-2 bg-neutral-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200 ${
                active ? `${ACCENT.border} ring-4 ring-rose-200` : 'border-transparent'
              }`}
              aria-pressed={active}
            >
              <ThumbWithFallback image={img} active={active} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                <span className="text-sm font-semibold text-white drop-shadow">{img.name}</span>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group grid aspect-square place-items-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
        >
          <div className="flex flex-col items-center gap-1.5">
            <Upload className="h-7 w-7" strokeWidth={2} />
            <span className="text-sm font-semibold">Upload</span>
          </div>
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

function ThumbWithFallback({ image, active }: { image: PuzzleImage; active: boolean }) {
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${image.fallback}`}>
      <img
        src={image.thumb}
        alt={image.name}
        className={`h-full w-full object-cover transition-transform duration-300 ${
          active ? 'scale-105' : 'group-hover:scale-105'
        }`}
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}
