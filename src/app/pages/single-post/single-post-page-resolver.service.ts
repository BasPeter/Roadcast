import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FirestoreService} from '../../services/firestoreService/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class SinglePostPageResolverService {

  constructor(private firestore: FirestoreService) {
  }

  resolve(route: ActivatedRoute): Promise<any> {
    return new Promise<any>(res => {
      this.firestore.posts.subscribe(posts => {
        if (posts !== null) {
          // res(posts.find(data => data.id === route.params['postId']));
        }
      });
    });
  }
}
