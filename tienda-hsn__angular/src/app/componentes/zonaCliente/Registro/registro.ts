import { JsonPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ServAPINode } from '../../../servicios/serv-apinode';
import { Subscription } from 'rxjs';
import IRespuestaNode from '../../../modelos/IRespuestaNode';

@Component({
  selector: 'app-registro',
  imports: [ ReactiveFormsModule, JsonPipe],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit, OnDestroy{
  //Solicito al DI la instancia del servicio ServAPINode para usar sus métodos
  // Lo puedo hacer en el constructor o haciendo uso de la funcion inject()

  private servAPINode = inject(ServAPINode);
  private idObservableRegistro?: Subscription;

  miform: FormGroup = new FormGroup(
    {
      nombre: new FormControl('',[
                                    Validators.required,
                                    Validators.minLength(3),
                                    Validators.maxLength(20)
                                  ]
                                ), //<--- objeto FormControl mapea a <input name='nombre' usando directiva FormControlName: formControlName="nombre_FormControl"
      apellidos: new FormControl('',
                                    [
                                      Validators.required,
                                      Validators.minLength(3),
                                      Validators.maxLength(30)
                                    ]
      ),
      email: new FormControl('',
                                    [
                                      Validators.required,
                                      Validators.email
                                    ]
      ),
      password: new FormControl('',
                                    [
                                      Validators.required,
                                      Validators.minLength(6),
                                      Validators.maxLength(15),
                                      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/)
                                    ]
      ),
      planAmigo: new FormControl('', Validators.required),
      genero: new FormControl('', Validators.required),
    }
  ); //<---objeto a mapear con tag <form...> usando directiva FormGroupDirective: [formGroup]="miform" (ngSubmit)="onSubmit()"

  ngOnDestroy(): void {
    console.log('Componente Registro destruido');
    // Si existe la suscripcion, la cancelamos para evitar fugas de memoria. NUNCA DEJAR OBSERVABLES ABIERTOS!!
    if(this.idObservableRegistro){
      this.idObservableRegistro.unsubscribe();
    }

  }
  ngOnInit(): void {
    console.log('Componente Registro iniciado');
  }

  
  getErrorMessage(campo: string): string {
    const control = this.miform.get(campo);
    if (!control || !control.errors) return '';

    if(control.hasError('required')){
      switch(campo){
        case 'nombre':
          return 'El nombre es obligatorio.';
        case 'apellidos':
          return 'Los apellidos son obligatorios.';
        case 'email':
          return 'El email es obligatorio.';
        case 'password':
          return 'La contraseña es obligatoria.';
        case 'planAmigo':
          return 'Debe seleccionar un plan.';
        case 'genero':
          return 'Debe seleccionar un género.';
      }
    }

    if(control.hasError('minlength')){
      const required = control.getError('minlength').requiredLength;
      switch(campo){
        case 'nombre':
          return `El nombre debe contener almenos ${required} caracteres`
        case 'apellidos':
          return `Los apellidos deben contener almenos ${required} caracteres`
        case 'password':
          return `La contraseña debe contener almenos ${required} caracteres`
      }
    }

    if(control.hasError('maxlength')){
      const required = control.getError("maxlength").requiredLength;
      switch(campo){
        case 'nombre':
          return `El nombre debe contener almenos ${required} caracteres`
        
        case 'apellidos':
          return `Los apellidos deben contener almenos ${required} caracteres`
        case 'password':
          return `La contraseña debe contener almenos ${required} caracteres`
      }
    }

    if(control.hasError('email')){
      return 'El email no tiene un formato válido.';
    }

    if(control.hasError('pattern')){
      return 'La contraseña debe tener al menos una letra y un número.';
    }

    return '';
  }
    


  MandarDatosRegistro():void{
    
    console.log('Datos del formulario de registro a mandar a nodejs....', this.miform.value);

    this.idObservableRegistro = this.servAPINode
                                        .Registro(this.miform.value)
                                        .subscribe(
                                          (respuesta:IRespuestaNode) => {
                                            console.log('Respuesta del servidor Node.js:', respuesta);
                                            //Comprobamos si el codigo == 0, entones, registro OK y decimos al cliente que revise su email para activar la cuenta
                                            // si no, mostramos el mensaje de error en la vista del componente
                                          }
                                        );
  }
} 
