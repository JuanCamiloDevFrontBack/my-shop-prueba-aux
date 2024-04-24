import { Injectable, NgZone, inject } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Login } from '../interfaces/login';
import { AlertsMsgService } from './alerts-msg.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {

  userData: unknown;

  private readonly firebaseAuthenticationService = inject(AngularFireAuth);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone)
  private readonly alerts = inject(AlertsMsgService);

  constructor() {
    this.firebaseAuthenticationService.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', 'null');
      }
    })
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  loadPageLogin(): void {
    this.router.navigate(['login']);
  }

  logInWithEmailAndPassword(form: Login) {
    return this.firebaseAuthenticationService.signInWithEmailAndPassword(form.email, form.password)
      .then(userCredential => {
        this.userData = userCredential.user
        this.observeUserState(1)
        this.alerts.success({ summary: 'alerts.login.success.session', msg: 'alerts.login.success.welcome' });
      })
      .catch(error => {
        this.alerts.error({ summary: 'alerts.login.error.session', msg: 'alerts.login.error.msg-err' });
      })
  }

  logInWithGoogleProvider() {
    return this.firebaseAuthenticationService.signInWithPopup(new GoogleAuthProvider())
      .then(() => {
        this.observeUserState(2);
        this.alerts.success({ summary: 'alerts.login.success.session', msg: 'alerts.login.success.welcome' });
      })
      .catch((error: Error) => {
        this.alerts.error({ summary: 'alerts.login.error.session', msg: 'alerts.login.error.msg-err' });
      })
  }

  signUpWithEmailAndPassword(form: Login) {
    return this.firebaseAuthenticationService.createUserWithEmailAndPassword(form.email, form.password)
      .then(userCredential => {
        this.userData = userCredential.user;
        this.observeUserState(3);
        this.alerts.success({ summary: 'alerts.sign-up.success.session', msg: 'alerts.sign-up.success.welcome' });
      })
      .catch(error => {
        this.alerts.error({ summary: 'alerts.sign-up.error.session', msg: 'alerts.sign-up.error.msg-err' });
      })
  }

  observeUserState(id: number) {
    const isRegistered = (id === 1 || id === 2);
    this.firebaseAuthenticationService.authState.subscribe(userState => {
      if (userState && isRegistered) {
        this.redirectToAcces('home');
      }
      else this.redirectToAcces('login');
    })
  }

  redirectToAcces(showPage: string): void {
    this.ngZone.run(() => this.router.navigate([showPage]));
  }

  logOut() {
    return this.firebaseAuthenticationService.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }

}
