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
import { Alert, AlertDescription } from '@/components/ui/alert';
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Hidden elements for processing */}
      <video ref={videoRef} className="sr-only" muted preload="auto" />
      <canvas ref={canvasRef} className="sr-only" />

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ScanText className="h-6 w-6 text-primary" />
            Extrator de Vídeo
          </h1>
          <p className="text-sm text-muted-foreground">
            Transcreva áudio e extraia texto visual de vídeos locais.
          </p>
        </div>

        {/* Step: Upload */}
        {step === 'upload' && (
          <div className="space-y-4">
            <VideoUploader
              onFileSelect={handleFileSelect}
              selectedFile={videoFile}
              onClear={handleClear}
            />
          </div>
        )}

        {/* Step: Config */}
        {step === 'config' && videoFile && (
          <div className="space-y-6">
            <VideoUploader
              onFileSelect={handleFileSelect}
              selectedFile={videoFile}
              onClear={handleClear}
            />

            <div className="rounded-xl border border-border bg-card p-5 space-y-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Settings2 className="h-4 w-4 text-primary" />
                Configurações
              </div>

              {/* What to extract */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">O que extrair</Label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setDoTranscription(v => !v)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      doTranscription
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <Mic className="h-4 w-4" />
                    Transcrição de áudio
                  </button>
                  <button
                    onClick={() => setDoOcr(v => !v)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      doOcr
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                    Texto da tela (OCR)
                  </button>
                </div>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language" className="text-xs text-muted-foreground uppercase tracking-wide">Idioma do vídeo</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSCRIPTION_LANGS.map(l => (
                      <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* OCR interval */}
              {doOcr && (
                <div className="space-y-3">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Capturar frame a cada <span className="text-foreground font-semibold">{frameInterval}s</span>
                  </Label>
                  <Slider
                    min={1}
                    max={30}
                    step={1}
                    value={[frameInterval]}
                    onValueChange={([v]) => setFrameInterval(v)}
                    className="w-full max-w-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Intervalo menor = mais precisão, mas mais lento. Para slides, 5–10s costuma ser suficiente.
                  </p>
                </div>
              )}

              {/* API key */}
              {doTranscription && (
                <div className="space-y-2">
                  <Label htmlFor="apikey" className="text-xs text-muted-foreground uppercase tracking-wide">
                    Chave de API OpenAI (Whisper)
                  </Label>
                  <Input
                    id="apikey"
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={e => handleApiKeyChange(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Necessária para transcrição. A chave fica salva apenas no navegador e nunca é enviada a servidores desta aplicação.
                  </p>
                </div>
              )}
            </div>

            {(!doTranscription && !doOcr) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Selecione ao menos uma extração.</AlertDescription>
              </Alert>
            )}

            <Button
              size="lg"
              className="w-full"
              disabled={(!doTranscription && !doOcr) || (doTranscription && !apiKey)}
              onClick={handleProcess}
            >
              <Play className="h-4 w-4 mr-2" />
              Processar vídeo
            </Button>

            {doTranscription && !apiKey && (
              <p className="text-xs text-destructive text-center">
                Informe a chave de API para transcrever o áudio.
              </p>
            )}
          </div>
        )}

        {/* Step: Processing */}
        {step === 'processing' && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <p className="text-sm font-medium">Processando...</p>

            {doTranscription && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-primary" />
                    Transcrição de áudio
                  </span>
                  {transcribing
                    ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    : transcriptionDone
                      ? <CheckCheck className="h-4 w-4 text-green-500" />
                      : null
                  }
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      transcriptionDone ? 'bg-green-500 w-full' : 'bg-primary w-1/2 animate-pulse'
                    }`}
                  />
                </div>
              </div>
            )}

            {doOcr && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    Leitura de texto na tela (OCR)
                  </span>
                  <span className="text-xs text-muted-foreground">{ocrProgress}%</span>
                </div>
                <Progress value={ocrProgress} className="h-2" />
              </div>
            )}
          </div>
        )}

        {/* Step: Results */}
        {step === 'results' && (
          <div className="space-y-4">
            <button
              onClick={() => setStep('config')}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-3 w-3" />
              Voltar às configurações
            </button>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="space-y-1">
                    {errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="combined">
              <TabsList className="w-full">
                <TabsTrigger value="combined" className="flex-1">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Combinado
                </TabsTrigger>
                {transcriptionResult && (
                  <TabsTrigger value="transcription" className="flex-1">
                    <Mic className="h-3.5 w-3.5 mr-1.5" />
                    Transcrição
                  </TabsTrigger>
                )}
                {ocrResults.length > 0 && (
                  <TabsTrigger value="ocr" className="flex-1">
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    Tela ({ocrResults.length})
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Combined */}
              <TabsContent value="combined" className="mt-4 space-y-3">
                {combinedText ? (
                  <>
                    <ResultActions
                      onCopy={() => copyToClipboard(combinedText)}
                      onDownload={() => downloadText(combinedText, `${videoFile?.name ?? 'video'}_extracao.txt`)}
                      copied={copied}
                    />
                    <Textarea
                      readOnly
                      value={combinedText}
                      className="font-mono text-xs min-h-[400px] resize-y"
                    />
                  </>
                ) : (
                  <EmptyState message="Nenhum conteúdo extraído." />
                )}
              </TabsContent>

              {/* Transcription */}
              {transcriptionResult && (
                <TabsContent value="transcription" className="mt-4 space-y-3">
                  <ResultActions
                    onCopy={() => copyToClipboard(transcriptionResult.fullText)}
                    onDownload={() => downloadText(transcriptionResult.fullText, `${videoFile?.name ?? 'video'}_transcricao.txt`)}
                    copied={copied}
                  />
                  {transcriptionResult.segments.length > 0 ? (
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {transcriptionResult.segments.map((seg, i) => (
                        <div key={i} className="flex gap-3 text-sm">
                          <span className="shrink-0 text-xs text-muted-foreground font-mono w-12 pt-0.5">
                            {formatTime(seg.start)}
                          </span>
                          <p className="flex-1">{seg.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Textarea
                      readOnly
                      value={transcriptionResult.fullText}
                      className="font-mono text-xs min-h-[400px] resize-y"
                    />
                  )}
                </TabsContent>
              )}

              {/* OCR */}
              {ocrResults.length > 0 && (
                <TabsContent value="ocr" className="mt-4 space-y-3">
                  <ResultActions
                    onCopy={() => copyToClipboard(ocrResults.map(r => `[${formatTime(r.timestamp)}]\n${r.text}`).join('\n\n---\n\n'))}
                    onDownload={() => downloadText(
                      ocrResults.map(r => `[${formatTime(r.timestamp)}]\n${r.text}`).join('\n\n---\n\n'),
                      `${videoFile?.name ?? 'video'}_ocr.txt`
                    )}
                    copied={copied}
                  />
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {ocrResults.map((r, i) => (
                      <div key={i} className="rounded-lg border border-border bg-muted/30 p-3 space-y-1">
                        <span className="text-xs text-muted-foreground font-mono">{formatTime(r.timestamp)}</span>
                        <p className="text-sm whitespace-pre-wrap">{r.text}</p>
                      </div>
                    ))}
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

function ResultActions({
  onCopy, onDownload, copied,
}: {
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex gap-2 justify-end">
      <Button variant="outline" size="sm" onClick={onCopy}>
        {copied ? <CheckCheck className="h-3.5 w-3.5 mr-1.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
        {copied ? 'Copiado!' : 'Copiar'}
      </Button>
      <Button variant="outline" size="sm" onClick={onDownload}>
        <Download className="h-3.5 w-3.5 mr-1.5" />
        Baixar .txt
      </Button>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
      <FileText className="h-8 w-8 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
