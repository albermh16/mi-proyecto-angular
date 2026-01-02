import { Component, computed, inject, Injector, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { ServAPINode } from '../../../../servicios/serv-apinode';
import { map, Observable, Subscription, tap } from 'rxjs';
import IRespuestaNode from '../../../../modelos/IRespuestaNode';
import { AsyncPipe, NgStyle } from '@angular/common';
import { StorageGlobal } from '../../../../servicios/storage-global';
import ICliente from '../../../../modelos/interfaces_ORM/ICliente';
import { CamelCaseStringPipe } from '../../../../pipes/camel-case-string-pipe';
import ICategoria from '../../../../modelos/interfaces_ORM/ICategoria';
import { toSignal } from '@angular/core/rxjs-interop';
import { DragAndDrop } from '../../../../directivas/drag-and-drop';
import IPedido from '../../../../modelos/interfaces_ORM/IPedido';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, CamelCaseStringPipe, DragAndDrop, NgStyle ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  private fetchNode = inject(ServAPINode);
  private storageGlobal = inject(StorageGlobal); //<--- inyectamos servicio de almacenamiento global, para recuperar datos del usuario logueado

  public cliente$:Signal<ICliente | null>=this.storageGlobal.GetDatosCliente().asReadonly();
  
  
  public categoriasPrincipales$ = this.fetchNode
                                      .GetCategorias('principales')
                                      .pipe(
                                        map( (resp:IRespuestaNode) => resp.codigo==0 ? resp.datos?.categorias : [] )
                                      );
  public subcategorias$:Observable<Array<ICategoria & {subcategorias: ICategoria[]}>> | null=null;
  public showPanel=signal<boolean>(false); //<----- señal para mostrar/ocultar el panel de subcategorias cuando paso el raton por encima de una categoria principal

  //señal para almacenar las subcategorias de la categoria principal sobre la que estamos situando el raton
  //public subcatSignal:Signal<Array<ICategoria & {subcategorias: ICategoria[]}>> = signal<Array<ICategoria & {subcategorias: ICategoria[]}>> ([]);

  public carrito:Signal<IPedido>= this.storageGlobal.GetCarrito().asReadonly(); //<---- obtenemos el carrito/pedido actual como señal de solo lectura
  public totalItems:Signal<number>=computed( () => this.carrito().itemsPedido.reduce( (acc, item) => acc + item.cantidad, 0) ); //<---- señal para almacenar el total de items en el carrito
  public showPanelItemsCart=signal<boolean>(false); //<---- señal para mostrar/ocultar el panel de items del carrito




CargarSubcats(categoria: ICategoria) {
  console.log('evento onmouseenter en categoria principal para cargar subcategorias, estas en CATEGORIA PRINCPAL=...', categoria);
  this.showPanel.set(true); // <---- muestro el panel de subcategorias
  this.subcategorias$ = this.fetchNode
                            .GetCategorias( categoria.pathCategoria)
                            .pipe(
                              tap( (resp:IRespuestaNode) => console.log('valor de la respuesta al recuperar subcategorias: ', resp.datos?.categorias) ),
                              map( (resp:IRespuestaNode) => {
                                if(resp.codigo!==0) return [];

                                let _subcats:Array<ICategoria & { subcategorias: ICategoria[]}>=[];
                                for(let cat of resp.datos.categorias){
                                  if ( /^\d+-\d+$/.test(cat.pathCategoria)){
                                      //categoría de 2º nivel, añadimos propiedad 'subcategorias':
                                      _subcats.push( { ...cat, subcategorias:[] } );
                                  } else {
                                      //categoría terciaria a procesar y a añadir a array 'subcategorias' creado arriba
                                      let catppal=_subcats.find( c=> new RegExp(`${cat.pathCategoria.split('-').slice(0,2).join('-')}$`).test(c.pathCategoria));	
                                      //console.log('categoría ppal a la q pertence subcat..',cat.pathCategoria.split('-').slice(0,2).join('-'), catppal);				
                                        catppal!['subcategorias']!.push(cat);
                                  }                               
                                }
                                return _subcats;
                              })
                            );
      //Convertimos el observable de subcategorias en una señal:....necesitamos asignar valor inicial para no devolver undefined al principio y evitar errores en template, y 
      //contexto de inyeccion 
      // this.subcatSignal=toSignal( this.fetchNode
      //                                 .GetCategorias( categoria.pathCategoria)
      //                                 .pipe(
      //                                   map(
      //                                      (resp:IRespuestaNode) => {
      //                                             if(resp.codigo!==0) return [];
      //                                             let _subcats:Array<ICategoria & { subcategorias: ICategoria[]}>=[];
      //                                             for(let cat of resp.datos.categorias){
      //                                               if ( /^\d+-\d+$/.test(cat.pathCategoria)){
      //                                                   //categoría de 2º nivel, añadimos propiedad 'subcategorias':
      //                                                   _subcats.push( { ...cat, subcategorias:[] } );
      //                                               } else {
      //                                                   //categoría terciaria a procesar y a añadir a array 'subcategorias' creado arriba
      //                                                   let catppal=_subcats.find( c=> new RegExp(`${cat.pathCategoria.split('-').slice(0,2).join('-')}$`).test(c.pathCategoria));
      //                                                   //console.log('categoría ppal a la q pertence subcat..',cat.pathCategoria.split('-').slice(0,2).join('-'), catppal);        
      //                                                     catppal!['subcategorias']!.push(cat);
      //                                               }
      //                                             }
      //                                             return _subcats;
      //                                           }
      //                                       )
      //                                     ), { initialValue: [], injector: inject(Injector) } 
      //                                   ); 


}

  //#region ----------- codigo recuperar categorias principales desde nodejs backend usando subscripcion a observables de forma manual -------------
  // private catsSusbcription:Subscription | null=null;
  // public categoriasPrincipales:ICategoria[]=[];


  // ngOnDestroy(): void {
  //   if(this.catsSusbcription){
  //     this.catsSusbcription.unsubscribe(); //<---- cierro observable de recup.categorias priincipales
  //   }
  // }
  // ngOnInit(): void {
  //   this.catsSusbcription=this.fetchNode
  //                                   .GetCategorias('principales')
  //                                   .subscribe( (resp:IRespuestaNode) => {
  //                                     if(resp.codigo==0){
  //                                       // hacer algo con resp.datos?.categorias
  //                                       this.categoriasPrincipales=resp.datos?.categorias || []; 
  //                                     }
  //                                   });
  // }
  //#endregion ----------- fin codigo recuperar categorias principales desde nodejs backend usando subscripcion a observables de forma manual -------------
}
