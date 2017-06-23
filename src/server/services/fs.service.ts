import { Injectable } from '@angular/core';
import { existsSync, readdir, readFile } from 'fs';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FsService {
  readDirectory(path: string) {
    return new Observable<string[]>(observer => {
      readdir(path, (error, files) => {
        if (error) {
          observer.error(error);
        } else {
          observer.next(files);
          observer.complete();
        }
      });
    });
  }

  readFile(path: string) {
    return new Observable<string>(observer => {
      readFile(path, (error, data) => {
        if (error) {
          observer.error(error);
        } else {
          observer.next(data.toString());
          observer.complete();
        }
      });
    });
  }

  fileExists(path: string) {
    return existsSync(path);
  }
}
