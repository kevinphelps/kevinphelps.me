import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlogEntryComponent } from './blog-entry/blog-entry.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { ResumeComponent } from './resume/resume.component';
import { BlogApiService } from './shared/services/blog-api.service';

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
    BlogApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
