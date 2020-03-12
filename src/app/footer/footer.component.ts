import { Component, OnInit } from '@angular/core';
import {AudioService} from '../services/audioService/audio.service';
import {StreamState} from '../services/audioService/stream-state';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  state: StreamState;

  constructor(private audio: AudioService) { }

  ngOnInit(): void {
    this.audio.getState().subscribe(state => {
      this.state = state;
    });
  }

}
