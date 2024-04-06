import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginE } from 'src/app/core/interfaces/login';
import { AuthServiceService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  inputs = LoginE;
  loginForm!: FormGroup;

  private readonly authService = inject(AuthServiceService);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
      this.createFormLogin();
  }

  createFormLogin(): void {
    this.loginForm = this.fb.group({
      [LoginE.email]: ['', [Validators.required, Validators.email]],
      [LoginE.pass]: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    });
  }

  onSubmit(): void {
    this.authService.logInWithEmailAndPassword(this.loginForm.value);
  }

  logInWithGoogle() {
    this.authService.logInWithGoogleProvider();
  }

}
