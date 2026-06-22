import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empty-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './empty-cart.component.html',
  styleUrl: './empty-cart.component.scss'
})
export class EmptyCartComponent {}
