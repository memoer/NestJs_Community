declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      SECRET_KEY: string;
    }
  }
}

export {};
