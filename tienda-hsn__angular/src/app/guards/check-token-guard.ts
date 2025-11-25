import { CanActivateFn } from '@angular/router';

export const checkTokenGuard: CanActivateFn = (route, state) => {
  //los guards pueden devolver:
  // -un booleano (sincrono)
  // -un Observable<boolean> | promise<boolean> (asincrono)
  //tendriamos que iyectar el servicio de acceso al stat
  return true;
};
