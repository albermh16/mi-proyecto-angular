import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

export const checkTokenGuard: CanActivateFn = (route, state) => {
  //los guards pueden devolver:
  // - un booleano (sincrono)
  // - un Observable<boolean> | Promise<boolean> (asincrono)
  // - un UrlTree | Observable<UrlTree> | Promise<UrlTree> para redirigir a otra ruta
  // - un RedirectCommand | Observable<RedirectCommand> | Promise<RedirectCommand> para redirigir a otra ruta

  // tendriamos que inyectar el servicio de acceso al state-global (store) y comprobar si hay token de acceso
  // accessToken + refreshToken devuelvo true <--- activo la ruta, si no hay token false <--- no activo la ruta
  
  //return true; // activo la ruta
  //return false; // no activo la ruta

  // - para crear un objeto UrlTree puedes usar la funcion angular:
  //          createUrlTreeFromSnapshot  <--- usa objeto activatedRouteSnapshot y crea url de redireccion https://angular.dev/api/router/createUrlTreeFromSnapshot    
  //  return createUrlTreeFromSnapshot(route.root || state.root, ['/Cliente/Login']);
  //
  // - tambien puedes devolver un objeto RedirectCommand: https://angular.dev/api/router/RedirectCommand
  //  const router=inject(Router);
  //  return new RedirectCommand( router.parseUrl('/Cliente/Login'));
  
  console.log('check-token-guard: comprobando token de acceso, variable ROUTE...', route);
  console.log('check-token-guard: comprobando token de acceso, variable STATE...', state);

  return createUrlTreeFromSnapshot(route.root, ['/Cliente/Login']); // redirijo a la ruta /Cliente/Login
};
