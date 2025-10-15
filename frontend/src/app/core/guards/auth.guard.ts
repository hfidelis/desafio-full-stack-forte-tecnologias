import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../../interfaces/user.interfaces';

export const AuthGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRoles = route.data?.['roles'] as string[] | undefined;
  const user: User | null = auth.currentUser;

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
