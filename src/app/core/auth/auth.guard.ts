import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (localStorage.getItem('ecowatt_token')) return true;
  return router.createUrlTree(['/login']);
};
