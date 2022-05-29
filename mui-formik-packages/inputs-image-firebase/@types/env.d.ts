declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STORYBOOK_FIREBASE_API_KEY: string;
      STORYBOOK_FIREBASE_AUTH_DOMAIN: string;
      STORYBOOK_FIREBASE_DB_URL: string;
      STORYBOOK_FIREBASE_PROJECT_ID: string;
      STORYBOOK_FIREBASE_STORAGE_BUCKET: string;
      STORYBOOK_FIREBASE_MESSAGE_SENDER_ID: string;
      STORYBOOK_FIREBASE_APP_ID: string;
      STORYBOOK_FIREBASE_MEASUREMENT_ID: string;
    }
  }
}

export {};
