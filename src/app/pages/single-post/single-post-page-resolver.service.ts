import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {FirestoreService} from '../../services/firestoreService/firestore.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SinglePostPageResolverService {

  constructor(private firestore: FirestoreService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<any>(resolve => {
      const postId = route.paramMap.get('postId');
      // if (!postIds.some(postId => postId.id  === selectedPostId)) {
      //   selectedPostId = postIds[0].id;
      // }
      this.firestore.getPost(postId).subscribe(post => {
        const result = {postId, post};
        resolve(result);
      });
    });
  }
}
