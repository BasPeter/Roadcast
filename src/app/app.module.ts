import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';

import {FlexLayoutModule} from '@angular/flex-layout';
import {environment} from '../environments/environment';
import {HeaderComponent} from './header/header.component';
import {OverviewPageComponent} from './pages/overview-page/overview-page.component';
import {AppRoutingModule} from './app.routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AddPostPageComponent} from './pages/add-post-page/add-post-page.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {HttpClientModule} from '@angular/common/http';


// Firebase
import {AngularFireModule} from '@angular/fire';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';

// CKEditor
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import { FooterComponent } from './footer/footer.component';
import { MusicPlayerComponent } from './music-player/music-player.component';
import { SinglePostComponent } from './pages/single-post/single-post.component';
import {SafePipe} from '../shared/pipe/safe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    OverviewPageComponent,
    AddPostPageComponent,
    FooterComponent,
    MusicPlayerComponent,
    SinglePostComponent,
    SafePipe
  ],
    imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireStorageModule,
        AngularFirestoreModule,
        AngularFireAuthModule,
        BrowserModule,
        FlexLayoutModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatCardModule,
        CKEditorModule,
        MatIconModule,
        MatButtonModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        FormsModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
  }
}
