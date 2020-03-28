import {Component, OnInit} from '@angular/core';
import {AudioService} from '../services/audioService/audio.service';
import {StreamState} from '../services/audioService/stream-state';
import {StorageService} from '../services/storageService/storage.service';
import {AudioFile} from '../services/storageService/audioFile';
import {MatSliderChange} from '@angular/material/slider';
import * as moment from 'moment';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit {

  state: StreamState;
  currentFile: AudioFile = {url: '', name: '', title: '', episode: '', location: ''};

  duration: number;

  constructor(private audio: AudioService, private storage: StorageService) {
  }

  ngOnInit(): void {
    this.storage.file.subscribe(file => {
      this.currentFile = file;
    });

    this.audio.getState().subscribe((state: StreamState) => {
      this.state = state;
    });
  }

  pause() {
    this.audio.pause();
  }

  play() {
    this.audio.play();
  }

  stop() {
    this.audio.stop();
  }

  onSliderChangeEnd(change) {
    this.audio.seekTo(change.value);
  }

}
