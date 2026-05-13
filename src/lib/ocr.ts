import { createWorker } from 'tesseract.js';

export interface OcrResult {
  timestamp: number;
  text: string;
}

function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(Boolean));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(Boolean));
  if (wordsA.size === 0 && wordsB.size === 0) return 1;
  const intersection = [...wordsA].filter(w => wordsB.has(w));
  return intersection.length / Math.max(wordsA.size, wordsB.size);
}

export async function processVideoFrames(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  language: string,
  intervalSeconds: number,
  onProgress: (current: number, total: number) => void
): Promise<OcrResult[]> {
  const duration = video.duration;
  const timestamps: number[] = [];
  for (let t = 0; t < duration; t += intervalSeconds) {
    timestamps.push(t);
  }

  const worker = await createWorker(language);
  const results: OcrResult[] = [];
  let lastText = '';

  try {
    for (let i = 0; i < timestamps.length; i++) {
      const t = timestamps[i];
      onProgress(i, timestamps.length);

      await seekVideo(video, t);

      const ctx = canvas.getContext('2d')!;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const dataUrl = canvas.toDataURL('image/png');
      const { data } = await worker.recognize(dataUrl);
      const text = data.text.trim();

      if (text.length > 10 && similarity(text, lastText) < 0.75) {
        results.push({ timestamp: t, text });
        lastText = text;
      }
    }
  } finally {
    await worker.terminate();
  }

  onProgress(timestamps.length, timestamps.length);
  return results;
}

function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Seek timeout')), 10000);
    video.onseeked = () => {
      clearTimeout(timeout);
      resolve();
    };
    video.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Video seek error'));
    };
    video.currentTime = time;
  });
}
