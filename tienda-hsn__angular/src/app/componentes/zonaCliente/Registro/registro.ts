import { Component } from '@angular/core';

@Component({
  selector: 'app-registro',
  imports: [],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  itemsPanelRegistro: string[] = [
              "Accederás a promociones y descuentos antes que nadie.",
              "Acumularás puntos = dinero para futuras compras.",
              "Recibirás cupones, regalos sorpresa sólo para registrados.",
              "Podrás invitar a tus amigos y conseguir 5€ en futuras compras.",
              "Puedes cargar tus pedidos anteriores con un solo click.",
              "Y mucho más...",
  ];
}
