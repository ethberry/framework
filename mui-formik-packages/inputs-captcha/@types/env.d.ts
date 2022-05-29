declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_RECAPTCHA_PUBLIC: string;
    }
  }
}

export {};
