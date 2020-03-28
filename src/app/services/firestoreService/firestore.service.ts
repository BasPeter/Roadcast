import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import 'firebase/firestore';
import {Post} from './post';
import * as firebase from 'firebase';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import DocumentReference = firebase.firestore.DocumentReference;
import Timestamp = firebase.firestore.Timestamp;


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
    this.postCollection = this.firestore.collection('posts', ref => ref.orderBy('date'));
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

  // editPost(id: string, post) {
  //   return this.postCollection.doc(id).update(post);
  // }

  // _________________________ NEW _________________________

  getPostIds(): Observable<{id: string, date: Date}[]> {
    return this.firestore.collection<{id: string, date: Date}>('post-ids', ref => ref.orderBy('date', 'desc')).valueChanges();
  }

  addPost(post: Post, id): Promise<DocumentReference> {
    this.firestore.doc(`post-ids/${id}`)
      .set({
        id,
        date: post.date
      });
    return this.firestore.doc(`posts/${id}`).set(post)
      .then()
      .catch(err => err);
  }

  getPost(id: string) {
    return this.firestore.doc<Post>(`posts/${id}`).valueChanges();
  }

  getTodayTimestamp() {
    return Timestamp.now();
  }

  updatePost(id: string, post) {
    return this.postCollection.doc(id).update(post);
  }
}
