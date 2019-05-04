import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'appSafeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private readonly domSanitizer: DomSanitizer) {}

  transform(value: string) {
    return this.domSanitizer.bypassSecurityTrustHtml(value);
  }
}
