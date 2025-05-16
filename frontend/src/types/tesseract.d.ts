declare module "tesseract.js" {
  interface RecognizeResult {
    data: {
      text: string;
    };
  }

  interface LoggerMessage {
    status: string;
    progress: number;
  }

  interface RecognizeOptions {
    logger?: (m: LoggerMessage) => void;
  }

  export function recognize(
    image: File | string,
    lang: string,
    options?: RecognizeOptions
  ): Promise<RecognizeResult>;
}
