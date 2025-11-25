import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import IRespuestaNode from '../modelos/IRespuestaNode';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root', //<--- Hace que el servicio sea "singleton" o compartido en toda la app por parte del DI
})

export class ServAPINode {
  // Aquí irían los métodos para llamar a la API de Node.js
  // por defecto no esta habilitado, hay que habilitarlo en app.config.ts <--- donde se definen las inyecciones de dependencias
  // por defecto se suele usar el constructor para ello
  //constructor(private http: HttpClient) { }

  //tambien se puede usar la funcion "inject()" de Angular
  private http = inject(HttpClient);
  
  public Registro(datosRegistro:{nombre:string,
                                apellidos:string,
                                email:string,
                                password:string, 
                                genero:string, 
                                planAmigo:string}
                              ): Observable<IRespuestaNode>{

                      return this.http
                            .post<IRespuestaNode>(
                                  'http://localhost:3000/api/Cliente/Registro',
                                  datosRegistro,
                                  {
                                    headers: { 'Content-Type': 'application/json' }
                                  }
                                );
                                // ).subscribe(
                                  
                                //     (valorRecibido:IRespuestaNode) => {
                                //       console.log('Respuesta correcta del servidor Node.js:', valorRecibido);
                                //       return valorRecibido;
                                //     },
                                //     (error) => { console.error('Error en la llamada a la API de Node.js:', error); },
                                //     () => { console.log('Llamada a la API de Node.js completada.'); }
                                  
                                // )
                              }

  public Login( email:string, password:string ): Observable<IRespuestaNode>{
    return this.http
          .post<IRespuestaNode>(
                'http://localhost:3000/api/Cliente/Login',
                { email, password },
                {
                  headers: { 'Content-Type': 'application/json' }
                }
              );
  }
}
