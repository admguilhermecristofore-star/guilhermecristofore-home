export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResult {
  fullText: string;
  segments: TranscriptionSegment[];
}

const WHISPER_SIZE_LIMIT = 25 * 1024 * 1024; // 25 MB

export async function transcribeVideo(
  file: File,
  apiKey: string,
  language?: string
): Promise<TranscriptionResult> {
  if (file.size > WHISPER_SIZE_LIMIT) {
    throw new Error(
      `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)} MB). O limite da API Whisper é 25 MB. Tente um vídeo menor ou comprima o arquivo.`
    );
  }

  const formData = new FormData();
  formData.append('file', file, file.name);
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'verbose_json');
  if (language) formData.append('language', language);

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      body?.error?.message ||
        `Erro na transcrição (HTTP ${response.status}). Verifique sua chave de API.`
    );
  }

  const data = await response.json();
  return {
    fullText: data.text ?? '',
    segments: (data.segments ?? []).map((s: { start: number; end: number; text: string }) => ({
      start: s.start,
      end: s.end,
      text: s.text.trim(),
    })),
  };
}
