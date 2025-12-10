import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'] as string;
  const currentUser = authService.getCurrentUserValue();

  if (currentUser && currentUser.role === requiredRole) {
    return true;
  }

  // Redirigir al dashboard si no tiene el rol requerido
  router.navigate(['/dashboard']);
  return false;
};
