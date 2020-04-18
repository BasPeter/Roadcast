import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {FirestoreService} from '../../services/firestoreService/firestore.service';
import {Observable, of} from 'rxjs';
import {first, mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OverviewPageResolverService implements Resolve<any> {

  constructor(private firestore: FirestoreService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<any>(resolve => {
      this.firestore.getPostIds().subscribe(postIds => {
        let selectedPostId = route.queryParamMap.get('post');
        if (!postIds.some(postId => postId.id  === selectedPostId)) {
          selectedPostId = postIds[0].id;
        }
        this.firestore.getPost(selectedPostId).subscribe(selectedPost => {
          const result = {postIds, selectedPostId, selectedPost};
          resolve(result);
        });
      });
    });
  }
}
