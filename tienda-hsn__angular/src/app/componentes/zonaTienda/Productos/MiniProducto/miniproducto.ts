import { Component, input } from '@angular/core';
import IProducto from '../../../../modelos/interfaces_ORM/IProducto';

@Component({
  selector: 'app-miniproducto',
  imports: [],
  templateUrl: './miniproducto.html',
  styleUrl: './miniproducto.css',
})
export class Miniproducto {

 productoAPintar=input<IProducto>(); //<---- propiedad de entrada recibida desde el componente padre 'Productos'
 cantidades=Array.from({ length: 12 }, (_, i) => i + 1);

//metodo q se dispara al iniciar el arrastre del <div> .... producto ....</div>

SetDragStart(eventoDrag: DragEvent, productoArrastrado: IProducto|undefined) {
  //nescesito establecer el dato en la prop. dataTransfer del evento de arrastre
  //el dato q voy a establecer es el id del producto arrastrado, para luego recuperarlo en el evento drop del carrito
  //usando el metodo setData() de dataTransfer.... https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData
  //en el metodo hay q poner 2 parametros:
  // - el 1º es el tipo de dato a pasar ej: application/json si es un json serializado, text/plain si es texto plano, etc...
  // - el 2º es el dato a pasar en formato string, en este caso el producto q es un objeto JSON LO TENGO que serializar a string
  eventoDrag.dataTransfer?.setData("application/json", JSON.stringify(productoArrastrado));
  
   console.log('Arrastrando producto:', productoArrastrado);
 }
}
