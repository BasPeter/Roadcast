import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FirestoreService} from '../../services/firestoreService/firestore.service';
import {Post} from '../../services/firestoreService/post';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit {

  postIds: {id: string, date: Date}[] = [];
  selectedPost: Observable<Post>;
  selectedPostId: string;
  get selectedPostIndex() {return this.postIds.findIndex(post => post.id === this.selectedPostId); }

  constructor(private firestore: FirestoreService,
              private router: Router,
              public auth: AuthService,
              private location: Location,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.firestore.getPostIds().subscribe(postIds => {
        this.postIds = postIds;
        this.handleQueryParameters();
      });

  }

  isPreviousPost() {
    return this.selectedPostIndex !== 0;
  }

  isNextPost() {
    return this.selectedPostIndex < this.postIds.length - 1;
  }

  previousPost() {
    if (this.isPreviousPost()) {
      this.selectedPostId = this.postIds[this.selectedPostIndex - 1].id;
      this.getPost();
    }
  }

  nextPost() {
    if (this.isNextPost()) {
      this.selectedPostId = this.postIds[this.selectedPostIndex + 1].id;
      this.getPost();
    }
  }

  getPost() {
    this.selectedPost = this.firestore.getPost(this.selectedPostId);
    this.updateLocationState();
  }

  // goToPage() {
  //   this.router.navigate(['post/' + this.selectedPostId]);
  // }

  updateLocationState(): void {
    const newLocation = `/?post=${this.selectedPostId}`;
    this.location.go(newLocation);
  }

  handleQueryParameters() {
    this.selectedPostId = this.activatedRoute.snapshot.queryParamMap.get('post');
    if (this.selectedPostId === null) {
      this.selectedPostId = this.postIds[0].id;
    }
    this.getPost();
  }


}

