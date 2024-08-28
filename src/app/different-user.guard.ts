import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,  Router }  from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DifferentUserGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const data = JSON.parse(localStorage.getItem(environment.localStorageKeyWord));
    const user_roles = data?.profile?.user_roles; 
    if(user_roles && user_roles.includes( "/EnricoUsers")) return true;
    if(user_roles && user_roles.includes("/Vendors")) {
      this.router.navigate(['/bgsw-vendor']);
      return false;
      // return true;
    }   

    // this.router.navigate(['/unauth']);
    // return false;
  }
  
}
