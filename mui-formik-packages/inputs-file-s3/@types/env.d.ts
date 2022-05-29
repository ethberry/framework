declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BE_URL: string;
      AWS_S3_BUCKET: string;
      AWS_REGION: string;

      STORYBOOK_BE_URL: string;
      STORYBOOK_AWS_S3_BUCKET: string;
      STORYBOOK_AWS_REGION: string;

      REACT_APP_BE_URL: string;
      REACT_APP_AWS_S3_BUCKET: string;
      REACT_APP_AWS_REGION: string;

      NEXT_PUBLIC_BE_URL: string;
      NEXT_PUBLIC_AWS_S3_BUCKET: string;
      NEXT_PUBLIC_AWS_REGION: string;
    }
  }
}

export {};
