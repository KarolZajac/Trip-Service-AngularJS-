import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthServiceService} from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {
  constructor(
    public authService: AuthServiceService,
    public router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      this.authService.user_getInformation().then(userInfo => {
        if (this.authService.isLoggedIn !== true) {
          resolve(false);
          this.router.navigate(['home']);
        } else if (this.authService.isLoggedIn === true && userInfo.role !== 'admin') {
          resolve(false);
          this.router.navigate(['home']);
        } else {
          resolve(true);
        }
      });
    });
  }

}
