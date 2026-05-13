import { useCallback, useState } from 'react';
import { Upload, Film, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const ACCEPTED_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-matroska'];
const MAX_DISPLAY_MB = 500;

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export function VideoUploader({ onFileSelect, selectedFile, onClear }: VideoUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const validate = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(mp4|webm|ogg|mov|mkv|avi)$/i)) {
      return 'Formato não suportado. Use MP4, WebM, MOV ou MKV.';
    }
    if (file.size > MAX_DISPLAY_MB * 1024 * 1024) {
      return `Arquivo muito grande (máx. ${MAX_DISPLAY_MB} MB).`;
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const err = validate(file);
    if (err) { setError(err); return; }
    setError('');
    onFileSelect(file);
  }, [onFileSelect]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  if (selectedFile) {
    const sizeMb = (selectedFile.size / 1024 / 1024).toFixed(1);
    return (
      <div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/5 px-4 py-3">
        <Film className="h-6 w-6 shrink-0 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium">{selectedFile.name}</p>
          <p className="text-xs text-muted-foreground">{sizeMb} MB</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClear} className="shrink-0 h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 cursor-pointer transition-all duration-200',
          dragging
            ? 'border-primary bg-primary/10 scale-[1.01]'
            : 'border-muted-foreground/30 bg-muted/20 hover:border-primary/60 hover:bg-primary/5'
        )}
      >
        <Upload className={cn('h-10 w-10 transition-colors', dragging ? 'text-primary' : 'text-muted-foreground')} />
        <div className="text-center">
          <p className="text-sm font-medium">Arraste o vídeo aqui</p>
          <p className="text-xs text-muted-foreground mt-1">ou clique para selecionar</p>
          <p className="text-xs text-muted-foreground mt-1">MP4, WebM, MOV, MKV — até {MAX_DISPLAY_MB} MB</p>
        </div>
        <input type="file" accept="video/*" className="sr-only" onChange={onInputChange} />
      </label>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
