import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const permissoesValidas = new Set([
      'ROLE_ADMIN',
      'ROLE_ARQUITETO',
      'ROLE_CONSTRUTORA',
      'ROLE_CLIENTE',
      'ROLE_DESIGN_INTERIORES',
      'ROLE_FORNECEDOR'
    ]);

    const usuario = this.authService.getUsuarioAutenticado();

    if (usuario) {
      const role = usuario.permissaoDoUsuario;
      if (permissoesValidas.has(role)) {
        return true;
      } else {
        this.router.navigate(['/forbidden']);
        return false;
      }
    }

    // Se não estiver autenticado
    this.router.navigate(['/login']);
    return false;
  }
}
