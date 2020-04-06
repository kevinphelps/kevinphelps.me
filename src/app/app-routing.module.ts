import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogEntryComponent } from './blog/blog-entry/blog-entry.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ResumeComponent } from './pages/resume/resume.component';
import { DefaultLayoutComponent } from './shared/components/default-layout/default-layout.component';
import { ProfileHeaderComponent } from './shared/components/profile-header/profile-header.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        component: ProfileHeaderComponent,
        children: [
          { path: '', component: BlogListComponent },
          { path: 'resume', component: ResumeComponent }
        ]
      },
      { path: 'blog/:blogEntry', component: BlogEntryComponent },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
