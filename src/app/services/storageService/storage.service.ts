import {Injectable} from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import 'firebase/storage';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import {AudioFile} from './audioFile';
import {map, mergeMap} from 'rxjs/operators';
import SettableMetadata = firebase.storage.SettableMetadata;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  audioFile: AudioFile = {url: '', name: '', episode: '', title: '', location: ''};

  metadata: SettableMetadata;

  private _file: BehaviorSubject<AudioFile> = new BehaviorSubject<AudioFile>(null);
  get file() {
    return this._file.asObservable();
  }

  constructor(private storage: AngularFireStorage) {
  }

  uploadTo(location: string, file: File): AngularFireUploadTask {
    const ref = this.storage.ref(location);
    return ref.put(file);
  }

  removeFrom(location: string): Promise<any> {
    const ref = this.storage.ref(location);
    return ref.delete().toPromise();
  }

  playAudio({episode, title, location}): Observable<AudioFile> {
    this.audioFile.episode = episode;
    this.audioFile.title = title;
    this.audioFile.location = location;
    this._file.next(this.audioFile);
    return this.file;
  }


  getUrlFrom(location: string): Observable<any> {
    return this.storage.ref(location).getDownloadURL();
  }

  getBackgroundImages() {
    let w600: string;
    let w768: string;
    let w960: string;
    let w1080: string;
    let full: string;
    return Promise.all([
    this.storage.ref('/afbeeldingen/background/RoadcastBackground_600.jpg').getDownloadURL()
      .toPromise()
      .then(url => w600 = url),

      this.storage.ref('/afbeeldingen/background/RoadcastBackground_768.jpg').getDownloadURL()
      .toPromise()
      .then(url => w768 = url),

      this.storage.ref('/afbeeldingen/background/RoadcastBackground_960.jpg').getDownloadURL()
      .toPromise()
      .then(url => w960 = url),

      this.storage.ref('/afbeeldingen/background/RoadcastBackground_1080.jpg').getDownloadURL()
      .toPromise()
      .then(url => w1080 = url),

      this.storage.ref('/afbeeldingen/background/RoadcastBackground_full.jpg').getDownloadURL()
      .toPromise()
      .then(url => full = url)
      ])
      .then(() => {
        return {w600, w768, w960, w1080, full};
      });
  }


}
