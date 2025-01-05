import { existsSync } from 'fs';
import { resolve } from 'path';
import * as process from 'process';

export function loadEnvPath(dest: string): string {
  const env: string | undefined = process.env.NODE_ENV;
  const fallBack: string = resolve(`${env}.env`);
  const fileName: string = env ? `${env}.env` : 'development.env';
  let filePath: string = resolve(`${dest}/${fileName}`);

  if (!existsSync(filePath)) filePath = fallBack;
  return filePath;
}
