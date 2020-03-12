import {Component, OnInit} from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {FirebaseUploadAdapter} from '../../uploadAdapter/FirebaseUploadAdapter';
import {StorageService} from '../../services/storageService/storage.service';
import {Post} from '../../../shared/models/post';
import {AuthService} from '../../services/auth.service';
import {FirestoreService} from '../../services/firestore.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-post-page',
  templateUrl: './add-post-page.component.html',
  styleUrls: ['./add-post-page.component.scss']
})
export class AddPostPageComponent implements OnInit {

  public editor = ClassicEditor;
  loader: any;
  isUploading = false;

  amountOfPosts: number;

  public post = {
    author: this.auth.user.email,
    title: '',
    date: new Date(Date.now()).toDateString(),
    episode: '',
    content: '<p>Begin nieuwe Post</p>',
    podcastUrl: ''
  };
  lo;

  constructor(
    private storage: StorageService,
    private auth: AuthService,
    private firestore: FirestoreService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.firestore.posts.subscribe(posts => {
      if (posts !== null) {
        this.amountOfPosts = posts.length;
        this.post.episode = (this.amountOfPosts < 10 ? 'E0' : 'E') + this.amountOfPosts;
      }
    });
  }

  addPost() {
    this.isUploading = true;
    console.log(this.post);
    this.firestore.addPost(this.post).then(post => {
      this.isUploading = false;
      post.get().then(doc => this.router.navigate(['post/' + doc.id]));
    });
  }

  public onReady(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      // Configure the URL to the upload script in your back-end here!
      return this.imageUploadAdapter(loader);
    };
  }

  imageUploadAdapter(loader: any) {
    this.loader = loader;

    const uploadInterface = {
      upload: () => this.uploadImage(this),
      abort: () => this.abortImageUpload(this)
    };

    return uploadInterface;
  }

  uploadImage(that: any): Promise<any> {
    return that.loader.file
      .then(file => {
          const location = `afbeeldingen/${file.name}`;
          const uploadTask = this.storage.uploadTo(location, file);
          uploadTask.percentageChanges().subscribe(percentage => that.loader.uploadPercentage = percentage);
          uploadTask.snapshotChanges().subscribe(changes => {
            that.loader.uploadTotal = changes.totalBytes;
            that.loader.uploaded = changes.bytesTransferred;
          });
          return uploadTask.then(() => this.storage.getDownloadUrl(location));
        }
      );
  }

  abortImageUpload(that: any) {
    console.log('Abort image upload.');
  }

}
