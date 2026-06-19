import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'productTranslate',
  standalone: true,
  pure: true
})
export class ProductTranslatePipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(productId: string, fallback: string): string {
    if (!productId) return fallback;

    const key = `products.${productId}.name`;
    const translated = this.translate.instant(key);

    return translated !== key ? translated : fallback;
  }
}
