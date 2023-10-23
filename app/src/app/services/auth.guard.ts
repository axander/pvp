import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  accept!: Promise<boolean>;

  constructor(
    private helper: JwtHelperService,
    private auth: AuthService,
    private router: Router
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let helper = new JwtHelperService();
    let decodedPluginData: any = this.helper.decodeToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbiI6ImxvY2FsaG9zdDo0MjAwIiwicmVkaXJlY3QiOiJodHRwczovL3JhYW5haGV5cmF0aS5jb20vIn0.3YqygqWd_SYOrNe-L32dUHmnYCq7We7FvE1M-YyvFyI');

    //this.accept = this.auth.getToken().then(result => {
    if (location.href == decodedPluginData['location']) {
      return true;
    } else {
      this.router.navigateByUrl(decodedPluginData['redirect']);
      return false;
    }
    //})
    return this.accept

  }

}
