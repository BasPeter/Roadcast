import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as CustomEditor from '../../customEditor/build/ckeditor.js';
import {StorageService} from '../../services/storageService/storage.service';
import {AuthService} from '../../services/auth.service';
import {FirestoreService} from '../../services/firestoreService/firestore.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Post} from '../../services/firestoreService/post';
import {AudioFile} from '../../services/storageService/audioFile';
import {AudioService} from '../../services/audioService/audio.service';

@Component({
  selector: 'app-add-post-page',
  templateUrl: './add-post-page.component.html',
  styleUrls: ['./add-post-page.component.scss']
})
export class AddPostPageComponent implements OnInit {

  public editor = CustomEditor;
  public previewEditor = CustomEditor;
  loader: any;
  isUploading = false;
  isUploadedNew = false;
  mode: 'add' | 'edit';

  amountOfPosts: number;

  postId: string;

  post: Post = {
    author: '',
    title: '',
    date: this.firestore.getTodayTimestamp(),
    episode: '',
    content: '<p>Begin nieuwe Post</p>',
    contentPreview: '',
    podcastUrl: '',
    podcastName: ''
  };

  @ViewChild('podcastUploadProgress', {static: true}) podcastUploadProgress: ElementRef;

  constructor(
    private storage: StorageService,
    private auth: AuthService,
    private firestore: FirestoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private audio: AudioService
  ) {
  }

  ngOnInit(): void {
    // set postId if exists, else generate new random id.
    this.postId = this.activatedRoute.snapshot.paramMap.get('postId') ?? Math.random().toString(36).substr(2, 9);

    this.firestore.getPost(this.postId).subscribe(post => {
      // if post exists in database
      if (post !== undefined) {
        this.mode = 'edit';
        Object.keys(this.post).forEach(key => {
          this.post[key] = post[key];
        });
      } else {
        // if post does not exist in database
        this.mode = 'add';
        this.auth.user.subscribe(user => this.post.author = user.email);
        this.firestore.getPostIds().subscribe(posts => {
          this.post.episode = (posts.length < 10 ? 'E0' : 'E') + (posts.length + 1);
        });
      }
    });
  }

  addPost() {
    this.isUploading = true;
    this.isUploadedNew = false;
    this.firestore.addPost(this.post, this.postId)
      .then(() => {
        this.isUploading = false;
        this.isUploadedNew = true;
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

  uploadImage(that: any) {
    return that.loader.file
      .then(file => {
          const location = `posts/${this.postId}/afbeeldingen/${file.name}`;
          const uploadTask = this.storage.uploadTo(location, file);
          uploadTask.percentageChanges().subscribe(percentage => that.loader.uploadPercentage = percentage);
          uploadTask.snapshotChanges().subscribe(changes => {
            that.loader.uploadTotal = changes.totalBytes;
            that.loader.uploaded = changes.bytesTransferred;
          });

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

  uploadPodcast(file: File) {
    const location = `posts/${this.postId}/podcast/${file.name}`;
    const uploadTask = this.storage.uploadTo(location, file);
    this.isUploading = true;
    uploadTask.percentageChanges().subscribe(percentage => {
      this.podcastUploadProgress.nativeElement.style.width = `${percentage}%`;
    });
    uploadTask.then(task => {
      Promise.all([
        task.ref.getDownloadURL().then(url => this.post.podcastUrl = url),
        task.ref.getMetadata().then(data => {
          this.post.podcastName = data.name;
        })
      ]).then(() => {
        this.firestore.updatePost(this.postId, {
          podcastUrl: this.post.podcastUrl,
          podcastName: this.post.podcastName
        })
          .then(() => {
            // hide progress bar
            this.podcastUploadProgress.nativeElement.style.width = 0;

            this.isUploading = false;
            this.isUploadedNew = true;
          });
      });
    });
  }

  removePodcast() {
    const location = `posts/${this.postId}/podcast/${this.post.podcastName}`;
    this.storage.removeFrom(location).then(() => {
      this.firestore.updatePost(
        this.postId,
        {
          podcastUrl: '',
          podcastName: ''
        });
    });
    this.isUploadedNew = true;
  }

  play() {
    this.audio.stop();
    this.storage.playAudio({
        title: this.post.podcastName,
        episode: this.post.episode,
        location: `posts/${this.postId}/podcast/${this.post.podcastName}`
      }
    ).subscribe((file: AudioFile) => {
      this.audio.playStream(file.location).then(stream => stream.subscribe(events => {
          // listening
        })
      );
    });
  }
}
