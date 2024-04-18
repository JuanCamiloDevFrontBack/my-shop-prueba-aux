import { Component, OnInit, inject } from '@angular/core';
import { AuthServiceService } from './core/services/auth.service';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

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
  private readonly translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['es', 'en']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('es');
    } else {
      this.translate.use(lang);
    }
  }

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
