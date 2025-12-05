import { HttpInterceptorFn, HttpResponse, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';


/*
 prompt original:

 Genera un interceptor de angular dentro del fichero #file:cache-requests-interceptor.ts  con este objetivo:
- detectar en parametro HttpRequest si la url ha sido ya solicitada con anterioridad o no; si es asi, evitar hacer la peticion con la funcion next(req) y devolver el valor HttpResponse almacenado en la cache
Directrices de codigo:
1. para el almacenamiento de peticiones en memoria usar un objeto Map, donde la clave va a ser el string formado por la url y sus  parametros y el valor, el objeto Response devuelto en la primera peticion
2. ante la posible perdida de datos en memoria por refresh, almacenar este objeto Map en el localstorage del navegador. Tenerlo en cuenta cuando se intente recuperar algun valor de la cache en memoria.

mejoras a implementar al prompt original:
 - maximo tamaño de la cache (número máximo de entradas). Si se supera, eliminar la entrada más antigua (FIFO).
 - tiempo de expiración para cada entrada en la cache. Si una entrada ha estado en la cache más allá de este tiempo, debe considerarse inválida y eliminarse.
 - validar que solo se cacheen las peticiones GET, para evitar problemas con POST/PUT/DELETE que pueden tener efectos secundarios.

*/

const CACHE_STORAGE_KEY = 'http_cache_v1';
const cache = new Map<string, HttpResponse<any>>();

function loadCacheFromLocalStorage(): void {
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw || '{}');
    for (const key of Object.keys(parsed)) {
      const item = parsed[key];
      const headers = new HttpHeaders(item.headers || {});
      const resp = new HttpResponse({ body: item.body, status: item.status, statusText: item.statusText, headers });
      cache.set(key, resp);
    }
  } catch (error) {
    console.warn('cacheRequestsInterceptor: fallo al cargar cache desde localStorage', error);
  }
}

function saveCacheToLocalStorage(): void {
  try {
    const obj: Record<string, any> = {};
    cache.forEach((resp, key) => {
      const headersObj: Record<string, string[] | string | null> = {};
      resp.headers.keys().forEach(h => {
        headersObj[h] = resp.headers.getAll(h) || null;
      });
      obj[key] = { body: resp.body, status: resp.status, statusText: resp.statusText, headers: headersObj };
    });
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(obj));
  } catch (error) {
    console.warn('cacheRequestsInterceptor: fallo al guardar cache en localStorage', error);
  }
}

// Cargar cache inicial desde localStorage (si existe)
loadCacheFromLocalStorage();

export const cacheRequestsInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo cachear peticiones GET (evita efectos secundarios con POST/PUT/DELETE)
  if (req.method !== 'GET') {
    return next(req);
  }

  // clave: url con sus parámetros
  const key = req.urlWithParams;

  // comprobar cache en memoria
  const cached = cache.get(key);
  if (cached) {
    // devolver la respuesta cacheada sin lanzar la petición
    return of(cached.clone()) as Observable<HttpEvent<any>>;
  }

  // si no está cacheada, realizar la petición y almacenarla cuando llegue la respuesta
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        // Almacenar una copia.clonada en memoria
        cache.set(key, event.clone());
        // Persistir mapa en localStorage
        saveCacheToLocalStorage();
      }
    })
  ) as Observable<HttpEvent<any>>;
};
