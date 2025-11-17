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
      apellidos: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
      planAmigo: new FormControl(),
      genero: new FormControl(),
    }
  ); //<---objeto a mapear con tag <form...> usando directiva FormGroupDirective: [formGroup]="miform" (ngSubmit)="onSubmit()"


  MandarDatosRegistro():void{
    console.log('Datos del formulario de registro a mandar a nodejs....', this.miform.value);

  }
} 