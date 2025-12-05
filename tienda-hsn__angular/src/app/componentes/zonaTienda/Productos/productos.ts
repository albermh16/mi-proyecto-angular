import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import IProducto from '../../../modelos/interfaces_ORM/IProducto';

@Component({
  selector: 'app-productos',
  imports: [],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  //para acceder a los datos resueltos por el resolver usamos el servicio del modulo de enrutamiento: ActivatedRoute
  // este servicio sirve para:
  // - acceder a los parametros de la ruta activa: /Tienda/Productos/:pathCategoria?oferta=valor&publico=valor (paramMap, snapshot.paramMap, ..)
  // - acceder a los datos resueltos por los resolvers asociados a la ruta activa (data, snapshot.data, ..)
  private activatedRoute = inject(ActivatedRoute);

  protected readonly productos : IProducto[] | [] = this.activatedRoute.snapshot.data['productos'];
  protected readonly categoria : string | null = this.activatedRoute.snapshot.paramMap.get('pathCategoria');
  protected readonly oferta: string = this.activatedRoute.snapshot.queryParamMap.get('oferta') || '';
  protected readonly publico: string = this.activatedRoute.snapshot.queryParamMap.get('publico') || '';

  ngOnInit(): void {
    console.log('Productos cargados por el resolver:', this.productos);
    console.log('Categoria de productos:', this.categoria);
    console.log('Filtro oferta:', this.oferta);
    console.log('Filtro publico:', this.publico);
  }



}
