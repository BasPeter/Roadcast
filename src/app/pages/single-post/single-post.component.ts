import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {AudioFile} from '../../services/storageService/audioFile';
import {StorageService} from '../../services/storageService/storage.service';
import {AudioService} from '../../services/audioService/audio.service';
import {Post} from '../../../shared/models/post';
import {ActivatedRoute} from '@angular/router';
import * as ViewerEditor from '../../customEditor/build/ckeditor';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {

  post: Post;
  content: string;
  public viewer = ViewerEditor;
  isLoggedIn: boolean;

  constructor(
    private storage: StorageService,
    private audio: AudioService,
    private auth: AuthService,
    private location: Location,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.post = this.activatedRoute.snapshot.data.post;
    this.auth.isLoggedIn.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
  }

  navigateBack() {
    this.location.back();
  }

  play() {
    this.audio.stop();
    this.storage.playAudio({
        title: this.post.title,
        episode: this.post.episode,
        location: '/testAudio/ES_Old Grump - Smartface.mp3'
        // location: 'testAudio/ES_Mass Hysteria - STRLGHT.mp3',
      }
    ).subscribe((file: AudioFile) => {
      this.audio.playStream(file.url).subscribe(events => {
        // listening
      });
    });
  }

}
