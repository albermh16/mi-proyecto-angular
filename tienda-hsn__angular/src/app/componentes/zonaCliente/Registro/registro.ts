import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [ ReactiveFormsModule, JsonPipe],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
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
    if(this.miform.invalid){

      
      this.miform.markAllAsTouched(); // <--- Marca todos los campos como tocados para mostrar los mensajes de error
      console.log('Formulario de registro no válido, revisa los errores....');
      return;
      
    }
    this.miform.valid; // <--- Aquí el formulario es válido
    
    console.log('Datos del formulario de registro a mandar a nodejs....', this.miform.value);

  }
} 
