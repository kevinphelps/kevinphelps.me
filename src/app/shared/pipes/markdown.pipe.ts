import { Pipe, PipeTransform } from '@angular/core';
import { highlightAuto } from 'highlight.js';
import * as marked from 'marked';

@Pipe({
  name: 'appMarkdown'
})
export class MarkdownPipe implements PipeTransform {
  transform(value: string) {
    return renderMarkdownToHtml(value);
  }
}

function renderMarkdownToHtml(markdown: string) {
  marked.setOptions({
    gfm: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    renderer: new marked.Renderer(),
    highlight: (code, lang) => {
      return highlightAuto(code, lang ? [lang] : undefined).value;
    }
  });

  return marked(markdown);
}
