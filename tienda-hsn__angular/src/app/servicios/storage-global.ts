import { Injectable, signal, WritableSignal } from '@angular/core';
import ICliente from '../modelos/interfaces_ORM/ICliente';
import IJwtTokens from '../modelos/IIwtTokens';
import IPedido from '../modelos/interfaces_ORM/IPedido';

@Injectable({
  providedIn: 'root',
})
export class StorageGlobal {
  //sericio para manejar el state-global de la aplicacion, comunicacion entre componentes
  //lo vamos a hacer con señales, antiguamente con BehaviorSubject
  private _cliente:WritableSignal<ICliente|null>=signal<ICliente|null>(null)
  private _tokens:WritableSignal<IJwtTokens|null>=signal<IJwtTokens|null>(null);

  private _inicioCarrito:IPedido={ itemsPedido:[], subtotal:0, gastosEnvio:0, total:0 };
  private _carrito:WritableSignal<IPedido>=signal<IPedido>(this._inicioCarrito); // <---- señal para almacenar el pedido/carrito actual


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

  GetCarrito(): WritableSignal<IPedido> {
    //si no hay carrito en la señal, puede ser por refresh de pagina, lo recupero del localStorage
    if (this._carrito() == null) {
      const carrito = JSON.parse(localStorage.getItem('carrito') || 'null');
      this._carrito.set(carrito);
    }
    return this._carrito;
  }

  EstablecerItemsCarrito( operacion:string, item:{producto:any, cantidad:number} ): void {
    //operacion puede ser 'add' para añadir item al carrito o 'remove' para eliminar item del carrito y 'modify' para modidicar cantidad
    const posItem= this._carrito().itemsPedido.findIndex( it => it.producto._id === item.producto._id );
    let itemsPedidoActual= this._carrito().itemsPedido;

    switch(operacion){
      case 'add':
        posItem == -1 ? itemsPedidoActual.push(item) : itemsPedidoActual[posItem].cantidad += item.cantidad;  
        break;
      
      case 'modify':
        if(posItem !== -1){
          itemsPedidoActual[posItem].cantidad = item.cantidad;
        }
        break;

      case 'remove':
        if(posItem !== -1){
          itemsPedidoActual=itemsPedidoActual.filter( i => i.producto._id !== item.producto._id );
          //itemsPedidoActual.splice(posItem, 1);
        }
        break;
    }
    //recalculo subtotal, gastos de envio y total
    const _Subtotal= itemsPedidoActual.reduce( (acum, it) => acum + ( it.producto.Precio * (1 - it.producto.Oferta/100) * it.cantidad), 0 );
    const _total=_Subtotal + this._carrito().gastosEnvio;

    //actualizo la señal del carrito, para hacerlo usas metodos o .set() <---- necesitas pasar un nuevo objeto
    //  o .update() <------ pasas una funcion q recibe el valor antiguo y devuelve el nuevo
    this._carrito.set( 
                      { 
                        ...this._carrito(),
                        itemsPedido: itemsPedidoActual, 
                        subtotal: _Subtotal, 
                        total: _total 
                    }
   );
   //almaceno tambien en localStorage para persistencia ante refresh de pagina
   localStorage.setItem('carrito', JSON.stringify( this._carrito() ) );

  }

  //#endregion
}
