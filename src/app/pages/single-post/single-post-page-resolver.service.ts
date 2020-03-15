import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FirestoreService} from '../../services/firestore.service';
import {Post} from '../../../shared/models/post';
import {Observable, of} from 'rxjs';

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
          res(posts.find(data => data.id === route.params['postId']));
        }
      });
    });
    // return this.firestore.posts.subscribe(posts => new Promise<any>(res => {
    //     if (posts !== null) {
    //       res(posts.find(data => data.id === route.params['postId']));
    //     }
    //   })
    // );
  }
}
