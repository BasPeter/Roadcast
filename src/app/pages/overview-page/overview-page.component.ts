import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {FirestoreService} from '../../services/firestore.service';
import {Post} from '../../../shared/models/post';
import {AudioService} from '../../services/audioService/audio.service';
import {StorageService} from '../../services/storageService/storage.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit {

  posts: Post[] = [];
  selectedIndex = 0;
  selectedPost: Post;
  isLoggedIn: boolean;

  constructor(private firestore: FirestoreService, private router: Router, private auth: AuthService) {
  }

  ngOnInit(): void {
    this.auth.isLoggedIn.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);

    this.firestore.posts.subscribe(
      data => {
        if (data !== null) {
          this.posts = data;
          if (this.selectedPost === undefined) {
            this.selectedPost = this.posts[this.selectedIndex];
          }
        }
      },
      error => error
    );
  }

  isPreviousPost() {
    return this.selectedIndex !== 0;
  }

  isNextPost() {
    return this.selectedIndex < this.posts.length - 1;
  }

  previousPost() {
    if (this.isPreviousPost()) {
      this.selectedIndex -= 1;
      this.selectedPost = this.posts[this.selectedIndex];
    }
  }

  nextPost() {
    if (this.isNextPost()) {
      this.selectedIndex += 1;
      this.selectedPost = this.posts[this.selectedIndex];
    }
  }

  goToPage() {
    this.router.navigate(['post/' + this.selectedPost.id]);
  }

}

