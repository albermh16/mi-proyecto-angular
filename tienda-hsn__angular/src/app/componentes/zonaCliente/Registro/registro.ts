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
export class Registro implements OnInit, OnDestroy {

  //solicito al DI la instancia del servicio ServAPINode para poder usar sus metodos
  //lo puedo hacer en el constructor o haciendo uso de la funcion "inject()"
  private servAPINode = inject( ServAPINode );
  private idObservableRegistro?: Subscription;

  miform: FormGroup = new FormGroup(
    {
      nombre: new FormControl('',[ Validators.required, Validators.minLength(3),Validators.maxLength(20)] ), //<--- objeto FormControl mapea a <input name='nombre' usando directiva FormControlName: formControlName="nombre_FormControl"
      apellidos: new FormControl( '',[ Validators.required, Validators.minLength(3),Validators.maxLength(50)] ),
      email: new FormControl('',[ Validators.required, Validators.email ] ),
      password: new FormControl( '',[ Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$')] ),
      planAmigo: new FormControl(),
      genero: new FormControl('',[ Validators.required]),
    }
  ); //<---objeto a mapear con tag <form...> usando directiva FormGroupDirective: [formGroup]="miform" (ngSubmit)="onSubmit()"


  ngOnDestroy(): void {
    console.log('componente Registro destruido...');
    //si existe la suscripcion la cierro para evitar fugas de memoria !!!NUNCA DEJAR OBSERVABLES ABIERTOS!!!
    if( this.idObservableRegistro ){
      this.idObservableRegistro.unsubscribe();
    }
  }
  ngOnInit(): void {
   console.log('componente Registro cargado...');
  }


  MandarDatosRegistro():void{
    console.log('datos del formulario de registro a mandar a nodejs...', this.miform.value);
    console.log('controles del formulario ...', this.miform.controls);

    this.idObservableRegistro = this.servAPINode
                                    .Registro( this.miform.value)
                                    .subscribe(
                                      (respuesta:IRespuestaNode) => {
                                        console.log('respuesta del backend nodejs tras registro', respuesta);
                                        //comprobamos si el codigo==0, entonces registro correcto y decimos al cliente q revise su email para activar cuenta
                                        //si no mostramos mensaje de error en la vista del componente
                                      }
                                    );

  }
}
