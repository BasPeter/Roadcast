import { Component } from '@angular/core';
import {StorageService} from './services/storageService/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RoadCast';

  url: {
    w600,
    w768,
    w960,
    w1080,
    full
  };

  constructor(private storage: StorageService) {
    this.storage.getBackgroundImages().then(data => {
      this.url = data;
    });
  }


}
