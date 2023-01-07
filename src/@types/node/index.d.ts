declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
		HOST: string;

    DATABASE_URI: string;
    DATABASE_TYPE: string;
    DATABASE_HOST: string;
    DATABASE_PORT: string;
    DATABASE_NAME: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;

		APP_HASHMAC_SECRET: string;
  }
}
