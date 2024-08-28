import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';

@Injectable({
  providedIn: 'root',
})
export class AdministratorGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const userProfileDetails = StorageQuery.getUserProfile();
    if (typeof userProfileDetails === 'object' && userProfileDetails !== null) {
      // if (
      //   userProfileDetails?.roles.length > 0 &&
      //   userProfileDetails?.roles.includes('Administrator')
      // )

      return true;
    }
    return false;
  }
}
