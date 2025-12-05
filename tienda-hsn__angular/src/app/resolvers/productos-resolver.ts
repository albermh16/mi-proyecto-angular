import { ResolveFn } from '@angular/router';
import IProducto from '../modelos/interfaces_ORM/IProducto';
import { ServAPINode } from '../servicios/serv-apinode';
import { inject } from '@angular/core';

export const productosResolver: ResolveFn<IProducto[]|[]> = (route, state) => {
  //inyectamos el servicio para hacer peticiones a nodejs
  const fetchNode=inject(ServAPINode);
  return [];
};
