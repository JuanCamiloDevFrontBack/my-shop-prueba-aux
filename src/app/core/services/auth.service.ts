import { Injectable, NgZone, inject } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Login } from '../interfaces/login';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {

  userData: unknown;

  private readonly firebaseAuthenticationService = inject(AngularFireAuth);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone)
  private readonly messageService = inject(MessageService);

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
        this.messageService.add({ severity: 'success', summary: 'Inicio de Sesión Éxitoso', detail: 'Bienvenido al sistema' });
      })
      .catch(error => {
        this.messageService.add({ severity: 'error', summary: 'Error de Inicio', detail: error.message });
      })
  }

  logInWithGoogleProvider() {
    return this.firebaseAuthenticationService.signInWithPopup(new GoogleAuthProvider())
      .then(() => {
        this.observeUserState(2);
        this.messageService.add({ severity: 'success', summary: 'Inicio de Sesión Éxitoso', detail: 'Inicio de sesión cpon Google fue éxitoso' });
      })
      .catch((error: Error) => {
        this.messageService.add({ severity: 'error', summary: 'Error de Inicio', detail: error.message });
      })
  }

  signUpWithEmailAndPassword(form: Login) {
    return this.firebaseAuthenticationService.createUserWithEmailAndPassword(form.email, form.password)
      .then(userCredential => {
        this.userData = userCredential.user;
        this.observeUserState(3);
        this.messageService.add({ severity: 'success', summary: 'Registro Éxitoso', detail: 'El registro de usurio fue éxitoso' });
      })
      .catch(error => {
        this.messageService.add({ severity: 'error', summary: 'Error al Registrase', detail: error.message });
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
