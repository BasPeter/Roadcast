import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {StorageService} from '../../services/storageService/storage.service';
import {AudioService} from '../../services/audioService/audio.service';
import {Post} from '../../services/firestoreService/post';
import {ActivatedRoute} from '@angular/router';
import * as ViewerEditor from '../../customEditor/build/ckeditor';
import {AuthService} from '../../services/auth.service';
import {Observable, of} from 'rxjs';
import {FirestoreService} from '../../services/firestoreService/firestore.service';
import {AudioFile} from '../../services/storageService/audioFile';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {

  postId: string;
  post: Post;
  content: string;

  public viewer = ViewerEditor;

  constructor(
    private storage: StorageService,
    private audio: AudioService,
    public auth: AuthService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private firestore: FirestoreService) {
  }

  ngOnInit() {
    // this.activatedRoute.params.subscribe(params => {
    //   this.postId = params.postId;
    //   this.post = this.firestore.getPost(this.postId);
    // });

    // this.post.subscribe(post => {
    //   this.content = post.content;
    // });


    this.activatedRoute.data.subscribe(data => {
      this.post = data.data.post;
      this.postId = data.data.postId;
      this.content = data.data.post.content;
    });
  }

  play() {
    this.audio.stop();

    // let title: string;
    // let episode: string;
    // let podcastName: string;

    // this.post.subscribe(post => {
    //   title = post.title;
    //   episode = post.episode;
    //   podcastName = post.podcastName;

    this.storage.playAudio({
        title: this.post.title,
        episode: this.post.episode,
        location: `posts/${this.postId}/podcast/${this.post.podcastName}`
      }
    ).subscribe((file: AudioFile) => {
      this.audio.playStream(file.location).then(stream => stream.subscribe(events => {
          // listening
        })
      );
      // });
    });
  }
}
