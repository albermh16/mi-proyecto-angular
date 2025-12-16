import { Directive, ElementRef, Host, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDrop {
  //directiva q vamos a usar para habilitar funcionalidad de arrastrar y soltar (drag and drop) en los elementos a los q se aplique esta directiva
  //en nuestro caso en el carrito del header de la tienda
 
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

  @HostListener('drop', ['$event']) dropDivCarrito(event: DragEvent) {
    event.preventDefault(); // Evitar el comportamiento por defecto
    this.el.nativeElement.classList.remove('drag-over');
    
    console.log('evento drop en div carrito...', event);
  }

  constructor(private el: ElementRef) { //<---- de forma predeterminada angular inyecta en el constructor de la directiva el elemento DOM al q se aplica la directiva
    console.log('Directiva DragAndDrop aplicada al elemento DOM:', this.el);
   }

}
