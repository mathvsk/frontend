import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (inject(AuthService).isAdmin()) return true;
  return router.createUrlTree(['/']);
};
