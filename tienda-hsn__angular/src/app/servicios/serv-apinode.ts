import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import IRespuestaNode from '../modelos/IRespuestaNode';
import { Observable } from 'rxjs';

// type IRespuestaNode = {
//   codigo: number,
//   mensaje: string,
//   datos?: any
// }

// interface IRespuestaNode {
//   codigo: number,
//   mensaje: string,
//   datos?: any
// }

@Injectable({
  providedIn: 'root', //<---- hace q servicio sea "singleton" o compartido en toda la app por parte del DI
})
export class ServAPINode {
  //definir aqui metodos para llamadas HTTP a nodejs backend, usando servicio HttpClient de angular
  //por defecto no esta habilitado, hay q habilitarlo en app.config.ts <--- donde se definen las inyecciones de dependencias
  
  //para solicitar al DI de angular q cree una instancia del servicio HttpClient para poder usarlo en este servicio
  //por defecto se suele usar el constructor para ello asi:
  //constructor( private http: HttpClient) { }
  
  //tambien se puede usar la funcion "inject()" de angular asi:
  private http = inject(HttpClient);

  public Registro(datosRegistro:{nombre:string, 
                                apellidos:string,
                                email:string, 
                                password:string, 
                                planAmigo:boolean, 
                                genero:string}
                  ):Observable<IRespuestaNode> {
        //devuelvo directamente el observable devuelto por el metodo post() del servicio HttpClient, no puedo devolver directamente la respuesta
        //porque es asincrona, por tanto devuelvo el observable para q el componente q llame a este metodo se suscriba a el
        return this.http
                    .post<IRespuestaNode>(
                            'http://localhost:3000/api/Cliente/Registro',
                            datosRegistro,
                            {
                              headers: { 'Content-Type': 'application/json' }
                            }
                        );
              // .subscribe(
              //   (valorRecibido:IRespuestaNode) => {
              //     console.log('respuesta correcta de nodejs backend', valorRecibido);
              //     respuestaServicio = valorRecibido;
              //   }, //funcion "next" de manejo de respuesta correcta
              //   (error)=>{ console.log('error en llamada HTTP POST a nodejs backend', error); }, //funcion "error" de manejo de error en la llamada
              //   ()=>{ console.log('finalizada llamada HTTP POST a nodejs backend'); } //funcion "complete" llamada al finalizar la llamada HTTP
              // )
      }

  public Login( email:string, password:string ):Observable<IRespuestaNode> {
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
