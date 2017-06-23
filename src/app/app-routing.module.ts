import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogEntryComponent } from './blog-entry/blog-entry.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { ResumeComponent } from './resume/resume.component';

export const routes: Routes = [
  {
    path: '', component: ProfileHeaderComponent, children: [
      { path: '', component: BlogListComponent },
      { path: 'resume', component: ResumeComponent }
    ]
  },
  { path: 'blog/:date/:urlSlug', component: BlogEntryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
