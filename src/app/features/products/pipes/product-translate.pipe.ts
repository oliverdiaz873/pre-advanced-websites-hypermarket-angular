import { Pipe, PipeTransform } from '@angular/core';

/**
 * ProductTranslatePipe - Devuelve el nombre del producto.
 *
 * F5.2: el `name` ya llega localizado por el backend (`?lang=es|en` vía
 * interceptor). El fallback recibido es el nombre localizado; se conserva el
 * contrato del pipe (recibe id + fallback) para no romper consumidores.
 */
@Pipe({
  name: 'productTranslate',
  standalone: true,
  pure: true
})
export class ProductTranslatePipe implements PipeTransform {
  transform(productId: string, fallback: string): string {
    return fallback;
  }
}