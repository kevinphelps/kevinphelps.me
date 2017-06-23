import { Injectable } from '@angular/core';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class FileCacheService {
  readonly cache: { [filePath: string]: string } = { };

  getFile(filePath: string, throwIfMissing = true) {
    filePath = resolve(filePath);

    let contents: string;

    if (this.cache[filePath]) {
      contents = this.cache[filePath];
    } else if (existsSync(filePath)) {
      contents = readFileSync(filePath).toString();
      this.cache[filePath] = contents;
    } else if (throwIfMissing) {
      throw new Error(`${filePath} not found.`);
    }

    return contents;
  }
}
