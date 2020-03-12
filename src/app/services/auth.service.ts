import {EventEmitter, Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import UserCredential = firebase.auth.UserCredential;
import {CanActivate, Router} from '@angular/router';
import {from, Observable} from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  private _userCredential: UserCredential;

  get user(): firebase.User {
    return this._userCredential.user;
  }

  isLoggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private auth: AngularFireAuth, private router: Router) {
  }

  canActivate(): Observable<boolean> {
    return from(this.auth.currentUser
      .then((user: firebase.User) => {
        if (user !== null) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  login(email: string, password: string): Promise<firebase.User> {
    if (this._userCredential === undefined) {
      return this.auth.signInWithEmailAndPassword(email, password)
        .then((cred: UserCredential) => {
          this._userCredential = cred;
          this.isLoggedIn.emit(true);
          return this.user;
        })
        .catch(err => err);
    }
    this.isLoggedIn.emit(false);
  }

  logout() {
    this.auth.signOut();
    this._userCredential = undefined;
  }
}
