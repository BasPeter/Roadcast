import {EventEmitter, Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import UserCredential = firebase.auth.UserCredential;
import {CanActivate, Router} from '@angular/router';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import * as firebase from 'firebase';
import {User} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  get user(): Observable<User> {
    return this._user.asObservable();
  }

  private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  get isLoggedIn(): Observable<boolean> {
    return this._isLoggedIn.asObservable();
  }

  private _isAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  get isAdmin(): Observable<boolean> {
    return this._isAdmin.asObservable();
  }

  constructor(private auth: AngularFireAuth, private router: Router) {
    const that = this;
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this._user.next(user);
        this.setRights();
      }
    });
    this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  }

  canActivate(): Observable<boolean> {
    return this.isAdmin;
  }

  login(email: string, password: string): void {
    if (this._user.getValue() === null) {
      this.auth.signInWithEmailAndPassword(email, password)
        .then((cred: UserCredential) => {
          this._user.next(cred.user);

          this.setRights();

        })
        .catch(err => err);
    }
  }

  logout() {
    this.auth.signOut().then(() => {
      this._user.next(null);
      this.resetRights();
    });
  }

  private setRights() {
    // set logged in
    this._isLoggedIn.next(true);

    // set admin
    this._user.getValue().getIdTokenResult().then(tokenIdResult => {
      if (this._isAdmin.getValue() !== tokenIdResult.claims.admin) {
        this._isAdmin.next(tokenIdResult.claims.admin);
      }
    });
  }

  private resetRights() {
    this._isAdmin.next(false);
    this._isLoggedIn.next(false);
  }
}
