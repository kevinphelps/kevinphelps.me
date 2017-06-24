import 'reflect-metadata';
import 'zone.js/dist/zone-node';

import { generateStaticSite } from 'ng-static-site-generator';

import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';

const pageUrls = [
  '/',
  '/resume'
];

const blogPath = './src/blog';
const distPath = './dist';

generateStaticSite(AppModule, AppComponent, pageUrls, blogPath, distPath);
