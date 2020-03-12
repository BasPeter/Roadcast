import {Injectable} from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import 'firebase/storage';
import {from, of} from 'rxjs';
import {AudioFile} from './audioFile';
import {map, mergeMap} from 'rxjs/operators';
import SettableMetadata = firebase.storage.SettableMetadata;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  audioFile: AudioFile = {url: '', name: '', episode: '', title: '', location: 'testAudio/ES_Mass Hysteria - STRLGHT.mp3'};

  metadata: SettableMetadata;

  constructor(private storage: AngularFireStorage) {
  }

  uploadTo(location: string, file: File): AngularFireUploadTask {
    const ref = this.storage.ref(location);
    return ref.put(file);
  }

  playAudio({episode, title, location}) {
    this.audioFile.episode = episode;
    this.audioFile.title = title;
    this.audioFile.location = location;
    return this.getFile();
  }

  getFile() {
    const ref = this.storage.ref(this.audioFile.location);

    return from(Promise.all([
        this.getUrl(ref).then((url: string) => this.audioFile.url = url),
        this.getName(ref).then((name: string) => this.audioFile.name = name)
      ]
    )
      .then(() => {
          return this.audioFile;
        }
      ));
  }

  getMetadata(ref: AngularFireStorageReference) {
    return ref.getMetadata().toPromise();
  }

  getUrl(ref: AngularFireStorageReference) {
    return ref.getDownloadURL().toPromise();
  }

  getName(ref: AngularFireStorageReference) {
    return ref.getMetadata().pipe(
      map(metadata => metadata.name)
    ).toPromise();
  }

  getDownloadUrl(location: string) {
    return this.storage.ref(location).getDownloadURL();
  }
}
