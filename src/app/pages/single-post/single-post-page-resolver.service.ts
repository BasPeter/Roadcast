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

  resolve(route: ActivatedRoute) {
    let $post: Observable<Post> = new Observable<Post>();
    this.firestore.posts.subscribe(posts => {
      if (posts !== null) {
        $post = of(posts.find(data => data.id === route.params['postId']));
      }
    });
    return $post;
  }
}
