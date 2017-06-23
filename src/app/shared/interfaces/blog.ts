export interface BlogEntryMetadata {
  title: string;
  description: string;
}

export interface BlogEntry extends BlogEntryMetadata {
  date: string;
  url: string;
  body: string;
}
