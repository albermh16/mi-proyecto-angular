import { Component, effect, inject, Injector, OnDestroy, OnInit, viewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel, Validators } from '@angular/forms';
import { Router, RouterLinkActive } from "@angular/router";
import { ServAPINode } from '../../../servicios/serv-apinode';
import IRespuestaNode from '../../../modelos/IRespuestaNode';
import { Subscription } from 'rxjs';
import { StorageGlobal } from '../../../servicios/storage-global';

@Component({
  selector: 'app-login',
  imports: [FormsModule], //<----- modulo necesario para trabajar con TEMPLATE-FORMS de angular, y usar directivas: NgModel, NgForm, etc
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login  implements OnInit, OnDestroy{

  //#region ------------ inyeccion de dependencias (servicios)  ------------------
  private fetchNode=inject(ServAPINode);
  private router:Router=inject(Router); //<----------- inyecto el servicio Router de angular para redirecciones desde codigo
  private storageGlobal=inject(StorageGlobal); //<---- inyecto el servicio StorageGlobal para manejar el state-global de la app
  private injector=inject(Injector); //<-------------- inyecto servicio Injector de angular para inyeccion de dependencias manual
  //#endregion -------------------------------------------------------------------

  //#region ------------ propiedades de clase del componente ----------------------

 LoginSubscriptor: Subscription | null = null;
 showPassword: boolean = false;
 miDivErrores=viewChild<HTMLDivElement>('divErrores'); //capturo la variable template #divErrores del div de errores

 //si quiero añadir validaciones personalizadas o validaciones usando la clase Validators de los formularios reactivos, usas
 //la funcion "viewChild" q captura una variable template para poder ser usada en el componente TS:
// emailInput=viewChild<NgModel>('email'); //capturo la variable template #email del input email
// passwodInput=viewChild<NgModel>('password'); //capturo la variable template #password del input password


 //modelo de datos a mapear en la vista del componente creada con formato TEMPLATE-FORMS
 modelLogin: { email: string; password: string } = { email: '', password: ''};
 //#endregion -------------------------------------------------------------------

//#region ------------ metodos de clase del componente ------------------

  ngOnInit(): void {
  //añado validadores a los campos del formulario (inputs) usando la referencia capturada con viewChild
  // this.emailInput()?.control.setValidators([ Validators.required, Validators.email ]);
  // this.passwodInput()?.control.setValidators([ Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};:,.\/?])(?!.*\s).{6,}$/) ]);
  console.log( 'componente de login cargado, valores de datos cliente en storage-global:', this.storageGlobal.GetDatosCliente()() );
  console.log( 'componente de login cargado, valores de tokens en storage-global:', this.storageGlobal.GetDatosTokens()() );
 
  //me gustaria añadir un efecto para notificar los cambios de los datos del state-global (storage-global) en este componente
  //OJOç!!!! esto cascara (abrir herramientas de desarrollo del navegaodr y ver la consola) pq este metodo no tiene contexto de inyeccion como en el constructor
  //o si lo usas en un sitio diferente al constructor, necesitas definir el contexto de inyeccion con "inject(....)"
  effect(
          () => {
                  console.log('efecto en componente login, datos cliente en storage-global han cambiado:', this.storageGlobal.GetDatosCliente()() );
                  console.log('efecto en componente login, datos tokens en storage-global han cambiado:', this.storageGlobal.GetDatosTokens()() );
              }, { injector: this.injector } //<----- si no lo pones te sale este error en consola: 
                                                    //  installHook.js:1 ERROR RuntimeError: NG0203: effect() can only be used within an injection context such as a constructor, a factory function, a field initializer, or a function used with `runInInjectionContext`. Find more at https://v20.angular.dev/errors/NG0203
                                                    // at assertInInjectionContext (root_effect_scheduler.mjs:2409:15)
                                                    // at effect (resource.mjs:137:9)
                                                    // at _Login.ngOnInit (login.ts:52:3)
)

}

  ngOnDestroy(): void {
    //libero recursos
    if( this.LoginSubscriptor ){
      this.LoginSubscriptor.unsubscribe();
    }
  }

SubmitLogin(formLogin: NgForm) {
  console.log('valor del formulario login enviado desde evento...', formLogin);
  console.log('valores del modelo de datos login:', this.modelLogin);
  this.LoginSubscriptor = this.fetchNode
                              .Login( this.modelLogin.email, this.modelLogin.password)
                              .subscribe(
                                    (respuesta:IRespuestaNode) => {
                                        console.log('respuesta correcta del servicio login de nodejs backend', respuesta);
                                        if( respuesta.codigo === 0 ){
                                          //almacenar los datos del cliente en el storage global junto con el accessToken y el refreshToken
                                          this.storageGlobal.EstablcerDatosCliente( respuesta.datos.cliente );
                                          this.storageGlobal.EstablacerDatosTokens(
                                             {
                                                accessToken: respuesta.datos.accessToken,
                                                refreshToken: respuesta.datos.refreshToken
                                            }
                                          );
                                          //y redirecciono a la tienda o panel del cliente
                                          this.router.navigateByUrl('/');
                                          //this.router.navegate(['/Tienda/MostrarProducto', idProducto])

                                        } else {
                                          //mostrar mensaje de error o con alert o en la vista
                                          this.miDivErrores()!.innerText = respuesta.mensaje;
                                        }
                                    }
                              );
}

 LoginWithGoogle() {}
 //#endregion ---------------------------------------------------------
}
