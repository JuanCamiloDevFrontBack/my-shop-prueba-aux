import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LoginE } from 'src/app/core/interfaces/login';
import { AuthServiceService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit, OnDestroy {

  inputs = LoginE;
  registerForm!: FormGroup;

  unsuscribe$!: Subject<void>

  private readonly authService = inject(AuthServiceService);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initVariables();
    this.createFormLogin();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
  }

  initVariables(): void {
    this.unsuscribe$ = new Subject<void>();
  }

  createFormLogin(): void {
    this.registerForm = this.fb.group({
      [LoginE.email]: ['', [Validators.required, Validators.email]],
      [LoginE.pass]: ['', Validators.required],
      [LoginE.confirmPass]: [''],
    });
    this.isEqualsInputPassword();
  }

  isEqualsInputPassword(): void {
    this.registerForm.get(LoginE.confirmPass)?.valueChanges
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe(value => this.isInvalidConfirmPassword(value));
  }

  isInvalidConfirmPassword(isPassword: string): void {
    const pass = this.registerForm.get(LoginE.pass)?.value;
    if (pass !== isPassword) {
      this.registerForm.get(LoginE.confirmPass)?.setErrors({
        passInvalidas: true
      })
    }
  }

  signUp(): void {
    this.authService.signUpWithEmailAndPassword(this.registerForm.value);
  }

  back(): void {
    this.authService.loadPageLogin();
  }

}
