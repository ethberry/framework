declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STORYBOOK_BE_URL: string;
      STORYBOOK_AWS_S3_BUCKET: string;
      STORYBOOK_AWS_REGION: string;
    }
  }
}

export {};
