import { CanActivateFn, ActivatedRouteSnapshot,Router } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { LoginComponent } from './login/login.component';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  const authService = inject(LoginComponent);
  const router = inject(Router);
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

