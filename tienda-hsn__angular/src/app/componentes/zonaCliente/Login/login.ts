import { Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel, Validators } from '@angular/forms';
import { Router, RouterLinkActive } from "@angular/router";
import { ServAPINode } from '../../../servicios/serv-apinode';
import IRespuestaNode from '../../../modelos/IRespuestaNode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormsModule], //<----- modulo necesario para trabajar con TEMPLATE-FORMS de angular, y usar directivas: NgModel, NgForm, etc
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
  

  // #region ------------ inyeccion de dependencias (servicios) ------------

  private fetchNode = inject(ServAPINode);
  private router:Router = inject(Router);

  // #endregion ------------------------------------------------------------

  // #region ------------ propiedades de clase del componente ------------
  
  LoginSubscription: Subscription | null = null;  
  showPassword: boolean = false;
  miDivErrores = viewChild<HTMLDivElement>('divErrores'); 

  //si quiero añadir validaciones personalizadas o validaciones usando la clase Validators de los formularios reactivos, usas
  //la funcion "viewChild" q captura una variable template para poder ser usada en el componente TS:
  //emailInput = viewChild<NgModel>('email'); //capturo la variable template #email del input email
  //passwodInput = viewChild<NgModel>('password'); //capturo la variable template #password del input password


  //modelo de datos a mapear en la vista del componente creada con formato TEMPLATE-FORMS
  modelLogin: { email: string; password: string } = { email: '', password: '' };


  // #endregion ------------------------------------------------------------

  ngOnInit(): void {
    //añado validadores a los campos del formulario (inputs) usando la referencia capturada con viewChild
    //this.emailInput()?.control.setValidators([Validators.required, Validators.pattern(/^.+@.+\..{2,3}$/)]);
    //this.passwodInput()?.control.setValidators([Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};:,.\/?])(?!.*\s).{6,}$/)]);
  }
  ngOnDestroy(): void {
    // libero recursos
    if (this.LoginSubscription) {
      this.LoginSubscription.unsubscribe();
    }
  }

  SubmitLogin(formLogin: NgForm) {
    console.log("Valor del formulario login enviado desde evento...", formLogin );
    console.log("Valores del modelo de datos login", this.modelLogin );
    this.LoginSubscription = this.fetchNode
                          .Login( this.modelLogin.email, this.modelLogin.password )
                          .subscribe(
                            (respuesta:IRespuestaNode) => {
                              console.log('Respuesta correcta del servidor Node.js:', respuesta);
                              if( respuesta.codigo === 0){
                                // almacenar los datos del cliente en el store global junto con el accessToken y el refreshToken

                                // y redirecciono a la tienda o panel del cliente
                                this.router.navigateByUrl('/Tienda/Home');
                                // this.router.navigate(['/Tienda/MostrarProductos', idProducto]);
                              } else {
                                // mostrar mensaje de error o con alert o en la vista
                                this.miDivErrores()!.innerText = respuesta.mensaje;
                              }
                            }
                          );

  }

  LoginWithGoogle() { }
} 