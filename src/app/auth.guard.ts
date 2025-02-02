// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { AuthService } from './auth.services';

// @Injectable({
//     providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//     constructor(private auth: AuthService, private router: Router) {}

//     canActivate(): boolean {
//         if (this.auth.isLoggedIn()) {
//             return true;
//         }
//         this.router.navigate(['/login']);
//         return false;
//     }
// }
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
