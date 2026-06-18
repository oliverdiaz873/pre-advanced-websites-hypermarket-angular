import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private cartService = inject(CartService);
  private router = inject(Router);

  // Expose total items signal for the header badge
  public totalItems = this.cartService.totalItems;

  public navigateToCart(): void {
    this.router.navigate(['/cart']);
  }
}
