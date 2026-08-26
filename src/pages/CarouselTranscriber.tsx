import { useState, useCallback } from "react";
import { FolderOpen, Play, Download, CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ImageFile {
  name: string;
  handle: FileSystemFileHandle;
}

interface CarouselFolder {
  name: string;
  handle: FileSystemDirectoryHandle;
  images: ImageFile[];
  status: "pending" | "running" | "done" | "error";
  transcript: string;
  error?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

function ext(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

async function scanDirectory(dirHandle: FileSystemDirectoryHandle): Promise<{
  subfolders: { name: string; handle: FileSystemDirectoryHandle; images: ImageFile[] }[];
}> {
  const subfolders: { name: string; handle: FileSystemDirectoryHandle; images: ImageFile[] }[] = [];

  for await (const [name, handle] of dirHandle.entries() as AsyncIterable<[string, FileSystemHandle]>) {
    if (handle.kind === "directory") {
      const dirH = handle as FileSystemDirectoryHandle;
      const images: ImageFile[] = [];
      for await (const [imgName, imgHandle] of dirH.entries() as AsyncIterable<[string, FileSystemHandle]>) {
        if (imgHandle.kind === "file" && IMAGE_EXTS.has(ext(imgName))) {
          images.push({ name: imgName, handle: imgHandle as FileSystemFileHandle });
        }
      }
      images.sort((a, b) => a.name.localeCompare(b.name));
      if (images.length > 0) {
        subfolders.push({ name, handle: dirH, images });
      }
    }
  }
  subfolders.sort((a, b) => a.name.localeCompare(b.name));
  return { subfolders };
}

async function fileToBase64(fileHandle: FileSystemFileHandle): Promise<{ b64: string; mediaType: string }> {
  const file = await fileHandle.getFile();
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  const mediaType = file.type || "image/jpeg";
  return { b64, mediaType };
}

async function transcribeCarousel(apiKey: string, images: ImageFile[]): Promise<string> {
  const content: object[] = [
    {
      type: "text",
      text:
        "Você é um assistente de transcrição. As imagens a seguir pertencem a um carrossel do Instagram. " +
        "Transcreva fielmente todo o texto visível em cada imagem, na ordem em que aparecem. " +
        "Separe o conteúdo de cada slide com uma linha vazia e um cabeçalho 'Slide N:'. " +
        "Não adicione comentários, análises ou formatações extras além da transcrição literal.",
    },
  ];

  for (let i = 0; i < images.length; i++) {
    const { b64, mediaType } = await fileToBase64(images[i].handle);
    content.push({
      type: "image",
      source: { type: "base64", media_type: mediaType, data: b64 },
    });
    content.push({ type: "text", text: `(Slide ${i + 1}: ${images[i].name})` });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-opus-5-20251101",
      max_tokens: 4096,
      messages: [{ role: "user", content }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `HTTP ${response.status}`);
  }

  const data = await response.json() as { content: { type: string; text: string }[] };
  return data.content.find((c) => c.type === "text")?.text ?? "";
}

async function saveTxt(dirHandle: FileSystemDirectoryHandle, folderName: string, text: string): Promise<void> {
  const fileName = `${folderName}_transcricao.txt`;
  const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(text);
  await writable.close();
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CarouselTranscriber() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [rootHandle, setRootHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [carousels, setCarousels] = useState<CarouselFolder[]>([]);
  const [scanning, setScanning] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleSelectFolder = useCallback(async () => {
    try {
      const handle = await (window as unknown as { showDirectoryPicker(): Promise<FileSystemDirectoryHandle> }).showDirectoryPicker();
      setRootHandle(handle);
      setCarousels([]);
      setProgress(0);
      setScanning(true);

      const { subfolders } = await scanDirectory(handle);
      setCarousels(
        subfolders.map((sf) => ({
          name: sf.name,
          handle: sf.handle,
          images: sf.images,
          status: "pending",
          transcript: "",
        }))
      );

      if (subfolders.length === 0) {
        toast({ title: "Nenhum carrossel encontrado", description: "Nenhuma subpasta com imagens foi encontrada." });
      } else {
        toast({ title: `${subfolders.length} carrossel(s) encontrado(s)`, description: "Clique em Iniciar para transcrever." });
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        toast({ title: "Erro ao acessar pasta", description: String(e), variant: "destructive" });
      }
    } finally {
      setScanning(false);
    }
  }, [toast]);

  const handleRun = useCallback(async () => {
    if (!apiKey.trim()) {
      toast({ title: "Chave de API ausente", description: "Informe sua Anthropic API Key.", variant: "destructive" });
      return;
    }
    if (carousels.length === 0) return;

    setRunning(true);
    setProgress(0);

    for (let i = 0; i < carousels.length; i++) {
      setCarousels((prev) =>
        prev.map((c, idx) => (idx === i ? { ...c, status: "running" } : c))
      );

      try {
        const carousel = carousels[i];
        const transcript = await transcribeCarousel(apiKey, carousel.images);
        await saveTxt(carousel.handle, carousel.name, transcript);
        setCarousels((prev) =>
          prev.map((c, idx) => (idx === i ? { ...c, status: "done", transcript } : c))
        );
      } catch (e) {
        setCarousels((prev) =>
          prev.map((c, idx) =>
            idx === i ? { ...c, status: "error", error: String(e) } : c
          )
        );
      }

      setProgress(Math.round(((i + 1) / carousels.length) * 100));
    }

    setRunning(false);
    toast({ title: "Transcrição concluída", description: "Arquivos TXT salvos em cada subpasta." });
  }, [apiKey, carousels, toast]);

  const handleDownload = (c: CarouselFolder) => {
    const blob = new Blob([c.transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${c.name}_transcricao.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleExpand = (name: string) =>
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));

  const done = carousels.filter((c) => c.status === "done").length;
  const errors = carousels.filter((c) => c.status === "error").length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">T</div>
        <div>
          <h1 className="text-lg font-semibold leading-none">Transcritor de Carrosséis Locais</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Transcreve imagens de subpastas via Claude Vision e salva arquivos TXT</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Config */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Configuração</h2>

          <div className="space-y-2">
            <Label htmlFor="api-key">Anthropic API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder="sk-ant-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showKey ? "Ocultar chave" : "Mostrar chave"}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">A chave é usada apenas no seu navegador e nunca é armazenada.</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleSelectFolder} disabled={scanning || running} variant="outline" className="gap-2">
              {scanning ? <Loader2 size={16} className="animate-spin" /> : <FolderOpen size={16} />}
              {rootHandle ? `Pasta: ${rootHandle.name}` : "Selecionar Pasta"}
            </Button>

            <Button onClick={handleRun} disabled={running || carousels.length === 0 || !apiKey.trim()} className="gap-2">
              {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
              {running ? "Transcrevendo…" : "Iniciar Transcrição"}
            </Button>
          </div>
        </section>

        {/* Progress */}
        {carousels.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {done} de {carousels.length} concluídos
                {errors > 0 && <span className="text-destructive ml-2">({errors} erro{errors > 1 ? "s" : ""})</span>}
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </section>
        )}

        {/* Carousels list */}
        {carousels.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Carrosséis Encontrados</h2>
            <ul className="space-y-2">
              {carousels.map((c) => (
                <li key={c.name} className="rounded-lg border border-border bg-card overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* Status icon */}
                    {c.status === "pending" && <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40 flex-shrink-0" />}
                    {c.status === "running" && <Loader2 size={16} className="animate-spin text-primary flex-shrink-0" />}
                    {c.status === "done" && <CheckCircle size={16} className="text-green-500 flex-shrink-0" />}
                    {c.status === "error" && <XCircle size={16} className="text-destructive flex-shrink-0" />}

                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm truncate block">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.images.length} imagem{c.images.length !== 1 ? "s" : ""}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {c.status === "done" && (
                        <>
                          <Badge variant="secondary" className="text-green-600 bg-green-500/10">Salvo</Badge>
                          <Button size="icon" variant="ghost" onClick={() => handleDownload(c)} title="Baixar TXT">
                            <Download size={14} />
                          </Button>
                        </>
                      )}
                      {c.status === "error" && (
                        <Badge variant="destructive">Erro</Badge>
                      )}
                      {(c.transcript || c.error) && (
                        <Button size="icon" variant="ghost" onClick={() => toggleExpand(c.name)}>
                          {expanded[c.name] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expanded content */}
                  {expanded[c.name] && (
                    <div className="border-t border-border px-4 py-3">
                      {c.error ? (
                        <p className="text-xs text-destructive font-mono">{c.error}</p>
                      ) : (
                        <Textarea
                          readOnly
                          value={c.transcript}
                          className="text-xs font-mono resize-none h-48"
                        />
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Instructions */}
        {carousels.length === 0 && !scanning && (
          <section className="rounded-lg border border-dashed border-border p-6 text-center space-y-2">
            <FolderOpen size={32} className="mx-auto text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Selecione uma pasta raiz que contenha <strong>subpastas de carrossel</strong>.
            </p>
            <p className="text-xs text-muted-foreground">
              Cada subpasta deve conter as imagens (JPG, PNG, WebP) de um carrossel.<br />
              Um arquivo <code>nomeDaSubpasta_transcricao.txt</code> será salvo em cada uma.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
