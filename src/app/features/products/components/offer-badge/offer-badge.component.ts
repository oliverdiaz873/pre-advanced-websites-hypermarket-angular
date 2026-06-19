import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-offer-badge',
  standalone: true,
  template: `
    <div class="offer-badge" aria-label="Oferta">
      <svg class="offer-badge__icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15" />
      </svg>
      @if (text) {
        <span class="offer-badge__text">{{ text }}</span>
      }
    </div>
  `,
  styles: [`
    .offer-badge {
      position: relative;
      display: inline-flex;
      align-items: center;
      padding: 3px 8px 3px 11px;
      border-radius: 15px;
      background: linear-gradient(135deg, #ff6b35 0%, hsl(33,100%,50%) 100%);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      pointer-events: none;
      user-select: none;
      line-height: 1;
    }

    @media (min-width: 768px) {
      .offer-badge {
        padding: 4px 10px 4px 14px;
        font-size: 12px;
      }
    }

    .offer-badge__icon {
      position: absolute;
      left: -8px;
      top: -6px;
      z-index: 15;
      width: 20px;
      height: 20px;
    }

    @media (min-width: 768px) {
      .offer-badge__icon {
        width: 24px;
        height: 24px;
        left: -10px;
        top: -6px;
      }
    }

    .offer-badge__text {
      position: relative;
      z-index: 1;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferBadgeComponent {
  @Input() text = '';
}
