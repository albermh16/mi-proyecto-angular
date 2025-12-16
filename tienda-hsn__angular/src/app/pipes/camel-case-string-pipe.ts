import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseString' //<---- nombre de la pipe para usar en el template del componente: {{ valor_a_transformar | camelCaseString }}
})                        // para pasar los parametros a la pipe: {{ valor_a_transformar | camelCaseString:param1:param2:... }}
export class CamelCaseStringPipe implements PipeTransform {

  transform(value: string, maxLength:number): string {
    //metodo q se ejecuta para transformar el valor, recibe al menos un parametro:
    // - value: valor a transformar <---- obligatorio
    // - args: array con parametros adicionales (opcional) <== no tiene pq declararse como un array, se pueden declarar
    //   varios parametros adicionales separados por comas
    // valor_a_transformar.split(' ').map( palabra => palabra.substring(0,1).toUpperCase() + palabra.substring(1,)).join(' ')
    let valorTranform='';
    valorTranform=value.split(' ').map( palabra => palabra.substring(0,1).toUpperCase() + palabra.substring(1,)).join(' ');
    
    if(maxLength && valorTranform.length>maxLength){
      return valorTranform.substring(0,maxLength)+'...';
    }
    return valorTranform;
  }

}
