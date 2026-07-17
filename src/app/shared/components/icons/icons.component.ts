import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icons.component.html',
  styleUrl: './icons.component.scss'
})
export class IconComponent {
  @Input({ required: true }) name!: string;
  @Input() className: string = '';
}
