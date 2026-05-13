export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResult {
  fullText: string;
  segments: TranscriptionSegment[];
}

export type TranscriptionProvider = 'groq' | 'openai';

const SIZE_LIMIT = 25 * 1024 * 1024; // 25 MB (both providers)

const PROVIDERS: Record<TranscriptionProvider, { url: string; model: string; label: string }> = {
  groq: {
    url: 'https://api.groq.com/openai/v1/audio/transcriptions',
    model: 'whisper-large-v3-turbo',
    label: 'Groq (gratuito)',
  },
  openai: {
    url: 'https://api.openai.com/v1/audio/transcriptions',
    model: 'whisper-1',
    label: 'OpenAI (pago)',
  },
};

export function getProviderLabel(provider: TranscriptionProvider) {
  return PROVIDERS[provider].label;
}

export async function transcribeVideo(
  file: File,
  apiKey: string,
  provider: TranscriptionProvider,
  language?: string
): Promise<TranscriptionResult> {
  if (file.size > SIZE_LIMIT) {
    throw new Error(
      `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)} MB). O limite é 25 MB.`
    );
  }

  const { url, model } = PROVIDERS[provider];

  const formData = new FormData();
  formData.append('file', file, file.name);
  formData.append('model', model);
  formData.append('response_format', 'verbose_json');
  if (language) formData.append('language', language);

  const response = await fetch(url, {
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
