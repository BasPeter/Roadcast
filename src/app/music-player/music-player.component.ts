import { Component, OnInit } from '@angular/core';
import {AudioService} from '../services/audioService/audio.service';
import {StreamState} from '../services/audioService/stream-state';
import {StorageService} from '../services/storageService/storage.service';
import {AudioFile} from '../services/storageService/audioFile';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit {

  // files: Array<any> = [];
  state: StreamState;
  currentFile: AudioFile = {url: '', name: '', title: '', episode: '', location: ''};

  constructor(private audio: AudioService, private storage: StorageService) { }

  ngOnInit(): void {
    this.storage.getFile().subscribe(file => {
      this.currentFile = file;
    });

    this.audio.getState().subscribe((state: StreamState) => {
      this.state = state;
    });
  }

  // playStream(url) {
  //   this.audio.playStream(url).subscribe(events => {
  //     // listening for fun here
  //   });
  // }

  // openFile(file) {
  //   this.currentFile = file;
  //   this.audio.stop();
    // this.playStream(file);
  // }

  pause() {
    this.audio.pause();
  }

  play() {
    this.audio.play();
  }

  stop() {
    this.audio.stop();
  }

  // next() {
  //   const index = this.currentFile.index + 1;
  //   const file = this.files[index];
  //   this.openFile(file, index);
  // }

  // previous() {
  //   const index = this.currentFile.index - 1;
  //   const file = this.files[index];
  //   this.openFile(file, index);
  // }

  // isFirstPlaying() {
  //   return this.currentFile.index === 0;
  // }

  // isLastPlaying() {
  //   return this.currentFile.index === this.files.length - 1;
  // }

  onSliderChangeEnd(change) {
    this.audio.seekTo(change.value);
  }

}
