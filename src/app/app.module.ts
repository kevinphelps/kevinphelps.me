import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';

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
import { TransferStatePipe } from './shared/pipes/transfer-state.pipe';

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

const pipes = [MarkdownPipe, SafeHtmlPipe, TransferStatePipe];

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'kevinphelps-me' }),
    BrowserTransferStateModule,
    HttpClientModule,
    AppRoutingModule
  ],
  declarations: [...components, ...pipes],
  bootstrap: [AppComponent]
})
export class AppModule {}
