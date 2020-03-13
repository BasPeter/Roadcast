import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import 'firebase/firestore';
import {Post} from '../../shared/models/post';
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import * as firebase from 'firebase';
import {BehaviorSubject, Observable} from 'rxjs';
import DocumentReference = firebase.firestore.DocumentReference;
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private postCollection: AngularFirestoreCollection<Post>;
  private _posts: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>(null);

  get posts(): Observable<Post[]> {
    return this._posts.asObservable();
  }

  constructor(private firestore: AngularFirestore) {
    this.postCollection = this.firestore.collection('posts');
    this.getPosts();
  }

  private getPosts() {
    this.postCollection.snapshotChanges()
      .pipe(
        map(actions => actions.map(
          doc => {
            const id = doc.payload.doc.id;
            const data = doc.payload.doc.data();
            return {id, ...data} as Post;
          }))
      )
      .subscribe(data => this._posts.next(data));
  }

  addPost(post): Promise<DocumentReference> {
    return this.postCollection.add(post).then();
  }

  editPost(post, id: string) {
    return this.postCollection.doc(id).update(post);
  }

  getPost(id: string) {
    return this.postCollection.doc<Post>(id).get();
  }
}
