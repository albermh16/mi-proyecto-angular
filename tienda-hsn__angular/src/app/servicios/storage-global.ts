import { Injectable, signal, WritableSignal } from '@angular/core';
import ICliente from '../modelos/interfaces_ORM/ICliente';
import IJwtTokens from '../modelos/IIwtTokens';

@Injectable({
  providedIn: 'root',
})
export class StorageGlobal {
  //sericio para manejar el state-global de la aplicacion, comunicacion entre componentes
  //lo vamos a hacer con señales, antiguamente con BehaviorSubject
  private _cliente:WritableSignal<ICliente|null>=signal<ICliente|null>(null)
  private _tokens:WritableSignal<IJwtTokens|null>=signal<IJwtTokens|null>(null);

  private _claveStorageCliente:string="cliente";
  private _claveStorageTokens:string="tokens";

  //#region ----metodos de clase a exponer a componentes -----

  GetDatosCliente(): WritableSignal<ICliente | null> {
    //comprobar si hay dato en la señal, por posible refresh....si no hay, intentar cargar desde localStorage
    //y cargarlo en la señal...
    if( this._cliente() === null ){
      const datosCliente=JSON.parse( localStorage.getItem(this._claveStorageCliente) || 'null' );
      this._cliente.set( datosCliente );
    }
    return this._cliente;
  }
  GetDatosTokens(): WritableSignal<IJwtTokens | null> {
    //comprobar si hay dato en la señal, por posible refresh....si no hay, intentar cargar desde localStorage
    //y cargarlo en la señal...
    if( this._tokens() === null ){
      const datosTokens=JSON.parse( localStorage.getItem(this._claveStorageTokens) || 'null' );
      this._tokens.set( datosTokens );
    }
    return this._tokens;
  }

  EstablcerDatosCliente(cliente:ICliente):void{
    //para modificar el valor de la señal usamos o bien:
    // - metodo .set( nuevoValor) //<----- se recomienda su uso para valores primitivos, no objetos ni arrays
    // - metodo .update(  (valor_antiguo)=> { ....;  return valor_nuevo} )) /<---- se recomienda su uso para objetos y arrays
    //this._cliente.set(cliente); //<--- ¿¿funcinonara correctamente??

    this._cliente.update( (valorAntiguo:ICliente|null) => {
      if (valorAntiguo) {
        //copiamos las propiedades del cliente nuevo en el antiguo
        return { ...valorAntiguo, ...cliente };
      } else {
        return cliente;
      }
    });

    //almacenamos en localStorage tambien
    localStorage.setItem( this._claveStorageCliente, JSON.stringify( this._cliente() ) );
  }

EstablacerDatosTokens(tokens:IJwtTokens):void{
    //this._tokens.set(tokens);//<--- ¿¿funcinonara correctamente??

    this._tokens.update( (valorAntiguo:IJwtTokens|null) => {
      if (valorAntiguo) {
        //copiamos las propiedades del cliente nuevo en el antiguo
        return { ...valorAntiguo, ...tokens };
      } else {
        return tokens;
      }
    })  
    //almacenamos en localStorage tambien
    localStorage.setItem( this._claveStorageTokens, JSON.stringify( this._tokens() ) );
  }
  //#endregion
}
