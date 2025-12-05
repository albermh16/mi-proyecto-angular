import { Component, inject } from '@angular/core';
import { ServAPINode } from '../../../../servicios/serv-apinode';
import { map } from 'rxjs';
import IRespuestaNode from '../../../../modelos/IRespuestaNode';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private fetchNode = inject(ServAPINode);

  public categoriasPrincipales$ = this.fetchNode
                                      .GetCategorias('principales')
                                      .pipe(
                                        map( (resp:IRespuestaNode) => resp.codigo==0 ? resp.datos?.categorias : [] )
                                      );
}
