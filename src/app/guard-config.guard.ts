import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';

@Injectable({
  providedIn: 'root',
})
export class GuardConfigGuard implements CanActivate {
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
      //   userProfileDetails?.roles.includes('EntityAdmin')
      // )
      return true;
    }
    return false;
  }
}
