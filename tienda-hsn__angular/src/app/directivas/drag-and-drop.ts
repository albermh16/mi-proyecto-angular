<<<<<<< HEAD
import { Directive, ElementRef, Host, HostListener, inject, output } from '@angular/core';
import { StorageGlobal } from '../servicios/storage-global';
=======
import { Directive, ElementRef, Host, HostListener } from '@angular/core';
>>>>>>> origin/main

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDrop {
  //directiva q vamos a usar para habilitar funcionalidad de arrastrar y soltar (drag and drop) en los elementos a los q se aplique esta directiva
  //en nuestro caso en el carrito del header de la tienda
<<<<<<< HEAD
   //private elem:ElementRef=inject(ElementRef) //<---- forma nueva de inyectar dependencia del elemento sobre el q aplico directiva
  private storageGlobal=inject(StorageGlobal); //<---- inyeccion del servicio de almacenamiento global para acceder al carrito
  public showPanelItemsCartEvent=output<boolean>();



=======
 
>>>>>>> origin/main
  //inteceptamos eventos dragover, dragleave, drop en el elemento DOM al q se aplica la directiva
  // y gestionamos la funcionalidad de arrastrar y soltar
  //para interceptar los eventos del elemento sobre el q se aplica la directiva usamos el decorador @HostListener de angular
  @HostListener('dragover', ['$event']) dragOverDivCarrito(event: DragEvent) {
    event.preventDefault(); // Evitar el comportamiento por defecto
    this.el.nativeElement.classList.add('drag-over');
    
    console.log('evento dragover en div carrito');
  }

  @HostListener('dragleave', ['$event']) dragLeaveDivCarrito(event: DragEvent) {
    event.preventDefault(); // Evitar el comportamiento por defecto
    this.el.nativeElement.classList.remove('drag-over');
    
    console.log('evento dragleave en div carrito');
  }

<<<<<<< HEAD
  @HostListener('drop', ['$event']) dropDivCarrito(evento: DragEvent) {
    evento.preventDefault(); // Evitar el comportamiento por defecto
    //this.el.nativeElement.classList.remove('drag-over');
    //aqui debo recuperar los datos del producto arrastrado y añadirlo al carrito....estos datos se han establecido en el evento DRAGSTART del producto
    //mediante el metodo setData() del objeto dataTransfer del evento dragstart...aqui los recuperaremos con getData()
    console.log('DROPEVENT en DIRECTIVA DRAG-AND-DROP: Drop sobre el elemento con directiva Drag and Drop', evento);

    const datosProductoString=evento.dataTransfer?.getData("application/json"); //recupero el string serializado del producto desde la propiedad dataTransfer del evento drag
    
    if (datosProductoString){
      const productoArrastrado=JSON.parse(datosProductoString); //deserializo el string a objeto JSON
      console.log('DROPEVENT en DIRECTIVA DRAG-AND-DROP: Producto soltado en el carrito:', productoArrastrado);
      
      //aqui debo llamar al servicio del carrito para añadir el producto al mismo
      this.storageGlobal.EstablecerItemsCarrito('add',{ producto:productoArrastrado, cantidad:1});
      //disparo evento para mostrar el panel de items del carrito en el layout
      this.showPanelItemsCartEvent.emit(true);
      
      console.log('DROPEVENT en DIRECTIVA DRAG-AND-DROP: Producto añadido al carrito, estado actual del carrito:', this.storageGlobal.GetCarrito()());
      
    }
=======
  @HostListener('drop', ['$event']) dropDivCarrito(event: DragEvent) {
    event.preventDefault(); // Evitar el comportamiento por defecto
    this.el.nativeElement.classList.remove('drag-over');
    
    console.log('evento drop en div carrito...', event);
>>>>>>> origin/main
  }

  constructor(private el: ElementRef) { //<---- de forma predeterminada angular inyecta en el constructor de la directiva el elemento DOM al q se aplica la directiva
    console.log('Directiva DragAndDrop aplicada al elemento DOM:', this.el);
   }

}
