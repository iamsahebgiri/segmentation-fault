import { envsafe, str } from 'envsafe';

if (process.browser) {
  throw new Error(
    'This should only be included on the client (but the env vars wont be exposed)',
  );
}

export const serverEnv = {
  ...envsafe({
    DATABASE_URL: str(),
    NEXT_APP_URL: str({
      allowEmpty: true,
      devDefault: 'http://localhost:3000',
    }),
    NEXTAUTH_SECRET: str({
      devDefault: 'xxx',
    }),
    NODE_ENV: str({
      choices: ['development', 'test', 'production'],
    }),
    GITHUB_ID: str({ allowEmpty: true, default: '' }),
    GITHUB_SECRET: str({ allowEmpty: true, default: '' }),
  }),
};
