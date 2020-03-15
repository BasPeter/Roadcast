import {Component, OnInit} from '@angular/core';
import * as CustomEditor from '../../customEditor/build/ckeditor.js';
import {StorageService} from '../../services/storageService/storage.service';
import {AuthService} from '../../services/auth.service';
import {FirestoreService} from '../../services/firestore.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Post} from '../../../shared/models/post';

@Component({
  selector: 'app-add-post-page',
  templateUrl: './add-post-page.component.html',
  styleUrls: ['./add-post-page.component.scss']
})
export class AddPostPageComponent implements OnInit {

  public editor = CustomEditor;
  loader: any;
  isUploading = false;

  amountOfPosts: number;

  mode: 'add' | 'edit';
  posts: Post[];

  public post = {
    author: this.auth.user.email,
    title: '',
    date: new Date(Date.now()).toDateString(),
    episode: '',
    content: '<p>Begin nieuwe Post</p>',
    podcastUrl: ''
  };

  constructor(
    private storage: StorageService,
    private auth: AuthService,
    private firestore: FirestoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    Promise.all([
      this.activatedRoute.data.subscribe((data) => this.mode = data.mode),
      this.firestore.posts.subscribe((posts: Post[]) => this.posts = posts)]
    ).then(() => {
        if (this.mode === 'add') {
          if (this.posts !== null) {
            this.amountOfPosts = this.posts.length;
            this.post.episode = (this.amountOfPosts < 10 ? 'E0' : 'E') + this.amountOfPosts;
          }
        }
        if (this.mode === 'edit') {
          const id = this.activatedRoute.snapshot.paramMap.get('postId');
          this.firestore.getPost(id).subscribe((post) => {
            this.post.author = post.get('author');
            this.post.title = post.get('title');
            this.post.date = post.get('date');
            this.post.episode = post.get('episode');
            this.post.content = post.get('content');
            this.post.podcastUrl = post.get('podcastUrl');
          });
        }
      }
    )
    ;
  }

  addPost() {
    this.isUploading = true;
    if (this.mode === 'add') {
      this.firestore.addPost(this.post).then(post => {
        this.isUploading = false;
        post.get().then(doc => this.router.navigate(['post/' + doc.id]));
      });
    } else if (this.mode === 'edit') {
      const id = this.activatedRoute.snapshot.paramMap.get('postId');
      this.firestore.editPost(this.post, id).then(post => {
        this.isUploading = false;
        this.router.navigate(['post/' + id]);
      });
    }
    //
    // console.log(this.post);
    // this.firestore.addPost(this.post).then(post => {
    //   this.isUploading = false;
    //   post.get().then(doc => this.router.navigate(['post/' + doc.id]));
    // });
  }

  public onReady(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      // Configure the URL to the upload script in your back-end here!
      return this.imageUploadAdapter(loader);
    };
    editor
  }

  imageUploadAdapter(loader: any) {
    this.loader = loader;

    const uploadInterface = {
      upload: () => this.uploadImage(this),
      abort: () => this.abortImageUpload(this)
    };

    return uploadInterface;
  }

  uploadImage(that: any) {
    return that.loader.file
      .then(file => {
          const location = `afbeeldingen/${file.name}`;
          const uploadTask = this.storage.uploadTo(location, file);
          uploadTask.percentageChanges().subscribe(percentage => that.loader.uploadPercentage = percentage);
          uploadTask.snapshotChanges().subscribe(changes => {
            that.loader.uploadTotal = changes.totalBytes;
            that.loader.uploaded = changes.bytesTransferred;
          });
          // return uploadTask.then(() => this.storage.getDownloadUrl(location));

          return uploadTask.then(async task => {
            const url = await task.ref.getDownloadURL();
            return {default: url};
          });
        }
      );
  }

  abortImageUpload(that: any) {
    console.log('Abort image upload.');
  }

}
