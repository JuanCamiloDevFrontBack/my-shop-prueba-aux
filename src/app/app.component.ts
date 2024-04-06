import { Component, OnInit, inject } from '@angular/core';
import { AuthServiceService } from './core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-shop';
  isActiveHeader!: boolean;

  private readonly authService = inject(AuthServiceService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.isActiveHeader = false;
    this.authService.loadPageLogin();
  }

  routeIsActive(): void {
    const currentUrl = this.router.url;
    const showHeader = (currentUrl === '/login' || currentUrl === '/sign-up')
    this.isActiveHeader = showHeader ? false : true;
  }

  logOut() {
    this.authService.logOut();
  }

}
