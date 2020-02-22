import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {OverviewPageComponent} from './pages/overview-page/overview-page.component';
import {AddPostPageComponent} from './pages/add-post-page/add-post-page.component';

const appRoutes: Routes = [
  {
    path: '',
    component: OverviewPageComponent
  },
  {
    path: 'nieuw',
    component: AddPostPageComponent
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
