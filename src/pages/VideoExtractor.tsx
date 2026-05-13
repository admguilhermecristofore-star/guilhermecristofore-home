import { useState, useRef, useCallback } from 'react';
import {
  Play, Settings2, FileText, Eye, Download, Copy, CheckCheck,
  Loader2, AlertCircle, Mic, ScanText, ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { VideoUploader } from '@/components/VideoUploader';
import { processVideoFrames, OcrResult } from '@/lib/ocr';
import { transcribeVideo, TranscriptionResult } from '@/lib/transcription';

type Step = 'upload' | 'config' | 'processing' | 'results';

const TRANSCRIPTION_LANGS = [
  { label: 'Português', value: 'pt' },
  { label: 'Inglês', value: 'en' },
  { label: 'Espanhol', value: 'es' },
  { label: 'Detecção automática', value: 'auto' },
];

const OCR_LANGS: Record<string, string> = {
  pt: 'por',
  en: 'eng',
  es: 'spa',
  auto: 'por+eng',
};

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function buildCombinedOutput(
  transcription: TranscriptionResult | null,
  ocrResults: OcrResult[]
): string {
  const lines: { time: number; label: string; text: string }[] = [];

  if (transcription) {
    for (const seg of transcription.segments) {
      lines.push({ time: seg.start, label: 'FALA', text: seg.text });
    }
    if (transcription.segments.length === 0 && transcription.fullText) {
      lines.push({ time: 0, label: 'FALA', text: transcription.fullText });
    }
  }

  for (const r of ocrResults) {
    lines.push({ time: r.timestamp, label: 'TELA', text: r.text });
  }

  lines.sort((a, b) => a.time - b.time);
  return lines.map(l => `[${formatTime(l.time)}] [${l.label}] ${l.text}`).join('\n\n');
}

export default function VideoExtractor() {
  const [step, setStep] = useState<Step>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') ?? '');
  const [language, setLanguage] = useState('pt');
  const [frameInterval, setFrameInterval] = useState(3);
  const [doTranscription, setDoTranscription] = useState(true);
  const [doOcr, setDoOcr] = useState(true);

  const [ocrProgress, setOcrProgress] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptionDone, setTranscriptionDone] = useState(false);
  const [ocrDone, setOcrDone] = useState(false);

  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [ocrResults, setOcrResults] = useState<OcrResult[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (file: File) => {
    setVideoFile(file);
    setStep('config');
  };

  const handleClear = () => {
    setVideoFile(null);
    setStep('upload');
  };

  const handleApiKeyChange = (v: string) => {
    setApiKey(v);
    localStorage.setItem('openai_api_key', v);
  };

  const handleProcess = useCallback(async () => {
    if (!videoFile) return;
    setErrors([]);
    setTranscriptionResult(null);
    setOcrResults([]);
    setOcrProgress(0);
    setTranscribing(false);
    setTranscriptionDone(false);
    setOcrDone(false);
    setStep('processing');

    const errs: string[] = [];

    const transcriptionPromise = doTranscription
      ? (async () => {
          setTranscribing(true);
          try {
            const result = await transcribeVideo(videoFile, apiKey, language === 'auto' ? undefined : language);
            setTranscriptionResult(result);
          } catch (e) {
            errs.push(`Transcrição: ${(e as Error).message}`);
          } finally {
            setTranscribing(false);
            setTranscriptionDone(true);
          }
        })()
      : Promise.resolve();

    const ocrPromise = doOcr
      ? (async () => {
          const video = videoRef.current!;
          const canvas = canvasRef.current!;

          await new Promise<void>((resolve, reject) => {
            video.onloadedmetadata = () => resolve();
            video.onerror = () => reject(new Error('Erro ao carregar vídeo para OCR'));
            video.src = URL.createObjectURL(videoFile);
            video.load();
          });

          try {
            const results = await processVideoFrames(
              video,
              canvas,
              OCR_LANGS[language] ?? 'por+eng',
              frameInterval,
              (cur, total) => setOcrProgress(total > 0 ? Math.round((cur / total) * 100) : 0)
            );
            setOcrResults(results);
          } catch (e) {
            errs.push(`OCR: ${(e as Error).message}`);
          } finally {
            setOcrDone(true);
            URL.revokeObjectURL(video.src);
          }
        })()
      : Promise.resolve();

    await Promise.all([transcriptionPromise, ocrPromise]);
    if (errs.length) setErrors(errs);
    setStep('results');
  }, [videoFile, apiKey, language, frameInterval, doTranscription, doOcr]);

  const combinedText = buildCombinedOutput(transcriptionResult, ocrResults);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', color: '#1a1a1a', fontFamily: 'system-ui, sans-serif' }}>
      {/* Hidden processing elements */}
      <video ref={videoRef} style={{ display: 'none' }} muted preload="auto" />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 16px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <ScanText size={24} color="#2563eb" />
            Extrator de Vídeo
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
            Transcreva áudio e extraia texto visual de vídeos locais.
          </p>
        </div>

        {/* Step: Upload */}
        {step === 'upload' && (
          <VideoUploader
            onFileSelect={handleFileSelect}
            selectedFile={videoFile}
            onClear={handleClear}
          />
        )}

        {/* Step: Config */}
        {step === 'config' && videoFile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <VideoUploader
              onFileSelect={handleFileSelect}
              selectedFile={videoFile}
              onClear={handleClear}
            />

            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, marginBottom: 20, color: '#374151' }}>
                <Settings2 size={16} color="#2563eb" />
                Configurações
              </div>

              {/* What to extract */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontWeight: 600 }}>
                  O que extrair
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setDoTranscription(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 14px', borderRadius: 8, fontSize: 14, cursor: 'pointer',
                      border: `2px solid ${doTranscription ? '#2563eb' : '#d1d5db'}`,
                      background: doTranscription ? '#eff6ff' : '#fff',
                      color: doTranscription ? '#2563eb' : '#6b7280',
                      fontWeight: doTranscription ? 600 : 400,
                    }}
                  >
                    <Mic size={15} />
                    Transcrição de áudio
                  </button>
                  <button
                    onClick={() => setDoOcr(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 14px', borderRadius: 8, fontSize: 14, cursor: 'pointer',
                      border: `2px solid ${doOcr ? '#2563eb' : '#d1d5db'}`,
                      background: doOcr ? '#eff6ff' : '#fff',
                      color: doOcr ? '#2563eb' : '#6b7280',
                      fontWeight: doOcr ? 600 : 400,
                    }}
                  >
                    <Eye size={15} />
                    Texto da tela (OCR)
                  </button>
                </div>
              </div>

              {/* Language */}
              <div style={{ marginBottom: 20 }}>
                <Label htmlFor="language" style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Idioma do vídeo
                </Label>
                <div style={{ marginTop: 8 }}>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" style={{ width: 220, background: '#fff', color: '#1a1a1a', borderColor: '#d1d5db' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSCRIPTION_LANGS.map(l => (
                        <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* OCR interval */}
              {doOcr && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 8 }}>
                    Capturar frame a cada{' '}
                    <span style={{ color: '#1a1a1a', fontWeight: 700 }}>{frameInterval}s</span>
                  </p>
                  <Slider
                    min={1} max={30} step={1}
                    value={[frameInterval]}
                    onValueChange={([v]) => setFrameInterval(v)}
                    style={{ maxWidth: 280 }}
                  />
                  <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
                    Para slides, 5–10s costuma ser suficiente.
                  </p>
                </div>
              )}

              {/* API Key */}
              {doTranscription && (
                <div>
                  <Label htmlFor="apikey" style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                    Chave de API OpenAI (Whisper)
                  </Label>
                  <Input
                    id="apikey"
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={e => handleApiKeyChange(e.target.value)}
                    style={{ marginTop: 8, fontFamily: 'monospace', background: '#fff', color: '#1a1a1a', borderColor: '#d1d5db' }}
                  />
                  <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                    Necessária para transcrição. Salva apenas no seu navegador.
                  </p>
                </div>
              )}
            </div>

            {!doTranscription && !doOcr && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', color: '#dc2626', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} />
                Selecione ao menos uma extração.
              </div>
            )}

            <button
              disabled={(!doTranscription && !doOcr) || (doTranscription && !apiKey)}
              onClick={handleProcess}
              style={{
                width: '100%', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 600,
                background: (!doTranscription && !doOcr) || (doTranscription && !apiKey) ? '#9ca3af' : '#2563eb',
                color: '#fff', border: 'none', cursor: (!doTranscription && !doOcr) || (doTranscription && !apiKey) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <Play size={16} />
              Processar vídeo
            </button>

            {doTranscription && !apiKey && (
              <p style={{ textAlign: 'center', fontSize: 13, color: '#dc2626' }}>
                Informe a chave de API para transcrever o áudio.
              </p>
            )}
          </div>
        )}

        {/* Step: Processing */}
        {step === 'processing' && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
            <p style={{ fontWeight: 600, marginBottom: 20, color: '#374151' }}>Processando...</p>

            {doTranscription && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 14, color: '#374151' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Mic size={15} color="#2563eb" />
                    Transcrição de áudio
                  </span>
                  {transcribing
                    ? <Loader2 size={15} color="#9ca3af" className="animate-spin" />
                    : transcriptionDone
                      ? <CheckCheck size={15} color="#16a34a" />
                      : null}
                </div>
                <div style={{ height: 8, background: '#e5e7eb', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    background: transcriptionDone ? '#16a34a' : '#2563eb',
                    width: transcriptionDone ? '100%' : '50%',
                    transition: 'width 0.3s',
                    animation: !transcriptionDone ? 'pulse 1.5s infinite' : undefined,
                  }} />
                </div>
              </div>
            )}

            {doOcr && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 14, color: '#374151' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Eye size={15} color="#2563eb" />
                    Leitura de texto na tela (OCR)
                  </span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{ocrProgress}%</span>
                </div>
                <Progress value={ocrProgress} className="h-2" />
              </div>
            )}
          </div>
        )}

        {/* Step: Results */}
        {step === 'results' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button
              onClick={() => setStep('config')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0, alignSelf: 'flex-start' }}
            >
              <ChevronLeft size={14} />
              Voltar às configurações
            </button>

            {errors.length > 0 && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px' }}>
                {errors.map((e, i) => (
                  <p key={i} style={{ color: '#dc2626', fontSize: 14 }}>{e}</p>
                ))}
              </div>
            )}

            <Tabs defaultValue="combined">
              <TabsList style={{ width: '100%', background: '#f3f4f6' }}>
                <TabsTrigger value="combined" style={{ flex: 1 }}>
                  <FileText size={14} style={{ marginRight: 6 }} />
                  Combinado
                </TabsTrigger>
                {transcriptionResult && (
                  <TabsTrigger value="transcription" style={{ flex: 1 }}>
                    <Mic size={14} style={{ marginRight: 6 }} />
                    Transcrição
                  </TabsTrigger>
                )}
                {ocrResults.length > 0 && (
                  <TabsTrigger value="ocr" style={{ flex: 1 }}>
                    <Eye size={14} style={{ marginRight: 6 }} />
                    Tela ({ocrResults.length})
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="combined" style={{ marginTop: 16 }}>
                {combinedText ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <ResultActions
                      onCopy={() => copyToClipboard(combinedText)}
                      onDownload={() => downloadText(combinedText, `${videoFile?.name ?? 'video'}_extracao.txt`)}
                      copied={copied}
                    />
                    <Textarea readOnly value={combinedText} style={{ fontFamily: 'monospace', fontSize: 12, minHeight: 400, background: '#fff', color: '#1a1a1a', borderColor: '#d1d5db' }} />
                  </div>
                ) : (
                  <EmptyState message="Nenhum conteúdo extraído." />
                )}
              </TabsContent>

              {transcriptionResult && (
                <TabsContent value="transcription" style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <ResultActions
                      onCopy={() => copyToClipboard(transcriptionResult.fullText)}
                      onDownload={() => downloadText(transcriptionResult.fullText, `${videoFile?.name ?? 'video'}_transcricao.txt`)}
                      copied={copied}
                    />
                    {transcriptionResult.segments.length > 0 ? (
                      <div style={{ maxHeight: 500, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {transcriptionResult.segments.map((seg, i) => (
                          <div key={i} style={{ display: 'flex', gap: 12, fontSize: 14, color: '#1a1a1a' }}>
                            <span style={{ flexShrink: 0, fontFamily: 'monospace', fontSize: 12, color: '#9ca3af', paddingTop: 2, width: 48 }}>
                              {formatTime(seg.start)}
                            </span>
                            <p style={{ flex: 1, margin: 0 }}>{seg.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Textarea readOnly value={transcriptionResult.fullText} style={{ fontFamily: 'monospace', fontSize: 12, minHeight: 400, background: '#fff', color: '#1a1a1a', borderColor: '#d1d5db' }} />
                    )}
                  </div>
                </TabsContent>
              )}

              {ocrResults.length > 0 && (
                <TabsContent value="ocr" style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <ResultActions
                      onCopy={() => copyToClipboard(ocrResults.map(r => `[${formatTime(r.timestamp)}]\n${r.text}`).join('\n\n---\n\n'))}
                      onDownload={() => downloadText(
                        ocrResults.map(r => `[${formatTime(r.timestamp)}]\n${r.text}`).join('\n\n---\n\n'),
                        `${videoFile?.name ?? 'video'}_ocr.txt`
                      )}
                      copied={copied}
                    />
                    <div style={{ maxHeight: 500, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {ocrResults.map((r, i) => (
                        <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#9ca3af' }}>{formatTime(r.timestamp)}</span>
                          <p style={{ margin: '4px 0 0', fontSize: 14, whiteSpace: 'pre-wrap', color: '#1a1a1a' }}>{r.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultActions({ onCopy, onDownload, copied }: { onCopy: () => void; onDownload: () => void; copied: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
      <Button variant="outline" size="sm" onClick={onCopy} style={{ background: '#fff', color: '#374151', borderColor: '#d1d5db' }}>
        {copied ? <CheckCheck size={14} style={{ marginRight: 6, color: '#16a34a' }} /> : <Copy size={14} style={{ marginRight: 6 }} />}
        {copied ? 'Copiado!' : 'Copiar'}
      </Button>
      <Button variant="outline" size="sm" onClick={onDownload} style={{ background: '#fff', color: '#374151', borderColor: '#d1d5db' }}>
        <Download size={14} style={{ marginRight: 6 }} />
        Baixar .txt
      </Button>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: '#9ca3af', gap: 8 }}>
      <FileText size={32} color="#d1d5db" />
      <p style={{ fontSize: 14 }}>{message}</p>
    </div>
  );
}
