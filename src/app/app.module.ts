import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlogEntryComponent } from './blog/blog-entry/blog-entry.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ResumeComponent } from './pages/resume/resume.component';
import { DefaultFooterComponent } from './shared/components/default-footer/default-footer.component';
import { DefaultHeaderComponent } from './shared/components/default-header/default-header.component';
import { DefaultLayoutComponent } from './shared/components/default-layout/default-layout.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ProfileHeaderComponent } from './shared/components/profile-header/profile-header.component';
import { MarkdownPipe } from './shared/pipes/markdown.pipe';
import { SafeHtmlPipe } from './shared/pipes/safe-html.pipe';
import { TransferStateModule } from './shared/transfer-state/transfer-state.module';

const components = [
  AppComponent,
  BlogEntryComponent,
  BlogListComponent,
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
  LoadingComponent,
  NotFoundComponent,
  ProfileHeaderComponent,
  ResumeComponent
];

const pipes = [MarkdownPipe, SafeHtmlPipe];

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'kevinphelps-me' }),
    HttpClientModule,
    AppRoutingModule,
    TransferStateModule.forRoot()
  ],
  declarations: [...components, ...pipes],
  bootstrap: [AppComponent]
})
export class AppModule {}
