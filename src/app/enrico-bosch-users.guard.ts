import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot,Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnricoBoschUsersGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const data = JSON.parse(localStorage.getItem(environment.localStorageKeyWord));
    const user_roles = data?.profile?.user_roles; 

    if (user_roles && user_roles.includes('/EnricoUsers')) {
      return true;
    } else {
      this.router.navigate(['/unauth']);
      return false;
    }  
  }
  
}
