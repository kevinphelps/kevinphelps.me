import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlogEntryComponent } from './blog/blog-entry/blog-entry.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ResumeComponent } from './pages/resume/resume.component';
import { ProfileHeaderComponent } from './shared/components/profile-header/profile-header.component';
import { BlogService } from './shared/services/blog.service';

@NgModule({
  declarations: [
    AppComponent,
    BlogEntryComponent,
    BlogListComponent,
    NotFoundComponent,
    ProfileHeaderComponent,
    ResumeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'kevinphelps.me' }),
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    BlogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
