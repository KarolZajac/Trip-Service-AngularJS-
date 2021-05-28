import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthServiceService} from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AddTripGuard implements CanActivate {
  constructor(
    public authService: AuthServiceService,
    public router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean | any {
    return new Promise(resolve => {
      if (this.authService.isLoggedIn !== true) {
        this.router.navigate(['home']);
      }
      this.authService.user_getInformation().then((user) => {
        if (user.role === 'admin' || user.role === 'employee') {
          resolve(true);
        }
      });
    });
  }

}
