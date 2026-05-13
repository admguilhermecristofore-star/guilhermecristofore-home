import { useCallback, useState } from 'react';
import { Upload, Film, X } from 'lucide-react';

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
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: '#eff6ff', border: '1px solid #bfdbfe',
        borderRadius: 10, padding: '12px 16px',
      }}>
        <Film size={22} color="#2563eb" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#1e40af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedFile.name}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{sizeMb} MB</p>
        </div>
        <button
          onClick={onClear}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#9ca3af', flexShrink: 0 }}
          title="Remover"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 12, borderRadius: 12, padding: '48px 24px', cursor: 'pointer',
          border: `2px dashed ${dragging ? '#2563eb' : '#d1d5db'}`,
          background: dragging ? '#eff6ff' : '#fff',
          transition: 'all 0.2s',
        }}
      >
        <Upload size={40} color={dragging ? '#2563eb' : '#9ca3af'} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#374151' }}>Arraste o vídeo aqui</p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9ca3af' }}>ou clique para selecionar</p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#d1d5db' }}>MP4, WebM, MOV, MKV — até {MAX_DISPLAY_MB} MB</p>
        </div>
        <input type="file" accept="video/*" style={{ display: 'none' }} onChange={onInputChange} />
      </label>
      {error && <p style={{ fontSize: 13, color: '#dc2626', marginTop: 6 }}>{error}</p>}
    </div>
  );
}
