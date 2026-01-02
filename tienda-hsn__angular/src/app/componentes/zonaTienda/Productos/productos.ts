import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import IProducto from '../../../modelos/interfaces_ORM/IProducto';
import { ServAPINode } from '../../../servicios/serv-apinode';
import IRespuestaNode from '../../../modelos/IRespuestaNode';
import { Miniproducto } from './MiniProducto/miniproducto';

@Component({
  selector: 'app-productos',
  imports: [ Miniproducto],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {
  //para acceder a los datos resueltos por el resolver usamos el servicio del modulo de enrutamiento: ActivatedRoute
  // este servicio sirve para:
  // - acceder a los parametros de la ruta activa: /Tienda/Productos/:pathCategoria?oferta=valor&publico=valor (paramMap, snapshot.paramMap, ..)
  // - acceder a los datos resueltos por los resolvers asociados a la ruta activa (data, snapshot.data, ..)
  private activatedRoute = inject(ActivatedRoute);
  private fetchNode = inject(ServAPINode);

  //protected readonly productos : IProducto[] | [] = this.activatedRoute.snapshot.data['productos'];
  //protected readonly oferta: string = this.activatedRoute.snapshot.queryParamMap.get('oferta') || '';
  //protected readonly publico: string = this.activatedRoute.snapshot.queryParamMap.get('publico') || '';
  protected readonly categoria : string | null = this.activatedRoute.snapshot.paramMap.get('pathCategoria');
  productosSignal:Signal<IRespuestaNode> = this.fetchNode.GetProductos(this.categoria!); //<---- señal con objetos asi: { codigo:..., mensaje: ..., datos: { productos: [ ....]} }
  //transformo esta señal para obtener solo el array de productos:
  productos:Signal<IProducto[] | []> = computed( ()=> this.productosSignal().codigo==0 ? this.productosSignal().datos!.productos : [] );




  // ngOnInit(): void {
  //   console.log('Productos cargados por el resolver:', this.productos);
  //   console.log('Categoria de productos:', this.categoria);
  //   console.log('Filtro oferta:', this.oferta);
  //   console.log('Filtro publico:', this.publico);
  // }



}
