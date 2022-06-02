declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STORYBOOK_GEMUNION_LICENSE: string;
    }
  }
}

export {};
