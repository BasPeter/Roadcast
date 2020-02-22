import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';

import {FlexLayoutModule} from '@angular/flex-layout';

// Firebase
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {HeaderComponent} from './header/header.component';
import {RouterModule} from '@angular/router';
import {OverviewPageComponent} from './pages/overview-page/overview-page.component';
import {AppRoutingModule} from './app.routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AddPostPageComponent} from './pages/add-post-page/add-post-page.component';
import {MatCardModule} from '@angular/material/card';

//CKEditor
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    OverviewPageComponent,
    AddPostPageComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    CKEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
