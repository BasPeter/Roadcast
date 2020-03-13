import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthService} from './services/auth.service';

import {OverviewPageComponent} from './pages/overview-page/overview-page.component';
import {AddPostPageComponent} from './pages/add-post-page/add-post-page.component';
import {SinglePostComponent} from './pages/single-post/single-post.component';
import {SinglePostPageResolverService} from './pages/single-post/single-post-page-resolver.service';

const appRoutes: Routes = [
  {
    path: '',
    component: OverviewPageComponent
  },
  {
    path: 'nieuw',
    component: AddPostPageComponent,
    canActivate: [AuthService],
    data: {
      mode: 'add'
    }
  },
  {
    path: 'nieuw/:postId',
    component: AddPostPageComponent,
    canActivate: [AuthService],
    data: {
      mode: 'edit'
    }
  },
  {
    path: 'post/:postId',
    component: SinglePostComponent,
    resolve: {
      post: SinglePostPageResolverService
    }
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
