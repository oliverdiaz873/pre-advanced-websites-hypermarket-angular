import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav aria-label="Breadcrumb">
      <ol class="breadcrumb" [class.breadcrumb-category]="variant === 'category'">
        @for (item of items; track item.label; let i = $index, first = $first, last = $last) {
          <li
            class="breadcrumb-item"
            [class.breadcrumb-item--first]="first"
            [class.breadcrumb-item--parent]="!first && !last && i === items.length - 2"
            [class.breadcrumb-item--middle]="!first && !last && i !== items.length - 2 && items.length > 3"
            [class.breadcrumb-item--mobile-resume]="items.length > 3 && !first && !last && i === items.length - 2"
            [class.breadcrumb-item--current]="last"
          >
            @if (last) {
              <span aria-current="page">{{ item.label }}</span>
            } @else if (item.url) {
              <a [routerLink]="item.url">{{ item.label }}</a>
            } @else {
              <span>{{ item.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [`
    :host {
      --breadcrumb-top-base: 65px;
      --breadcrumb-top-desktop: 75px;
      --bg-overlay: rgba(0, 0, 0, 0.85);
      --color-primary: #ffcc00;
    }

    .breadcrumb {
      background: var(--bg-overlay);
      padding: 8px 15px;
      border-radius: 10px;
      max-width: 90%;
      margin: 0 auto;
      font-size: 14px;
      color: #ffffff;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
      list-style: none;
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      text-overflow: clip;
      position: fixed;
      top: var(--breadcrumb-top-base);
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .breadcrumb::-webkit-scrollbar {
      display: none;
    }

    .breadcrumb li {
      display: flex;
      align-items: center;
      margin: 0 5px;
    }

    .breadcrumb li:not(:last-child)::after {
      content: "\\203A";
      color: #ffffff;
      margin-left: 5px;
    }

    .breadcrumb a,
    .breadcrumb span {
      color: #ffffff;
      text-decoration: none;
      transition: color 0.3s;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
      background-color: rgba(255, 255, 255, 0.2);
    }

    .breadcrumb-item--current,
    .breadcrumb-item--current span,
    .breadcrumb li[aria-current="page"] {
      color: var(--color-primary);
      font-weight: 600;
    }

    @media (max-width: 767px) {
      .breadcrumb {
        max-width: calc(100vw - 20px);
        padding: 6px 12px;
        font-size: 13px;
        justify-content: flex-start;
        flex-wrap: nowrap;
        row-gap: 0;
        white-space: nowrap;
        overflow: hidden;
      }

      .breadcrumb li {
        flex: 0 0 auto;
        max-width: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .breadcrumb-item--middle {
        display: none !important;
      }

      .breadcrumb-item--mobile-resume::before {
        content: "... ";
        color: #ffffff;
      }

      .breadcrumb-item--current {
        flex: 1 1 auto;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .breadcrumb-item--current::before {
        content: "";
      }
    }

    @media (min-width: 768px) {
      .breadcrumb {
        font-size: 15px;
        padding: 10px 20px;
        max-width: 95%;
        overflow-x: auto;
        overflow-y: hidden;
        text-overflow: clip;
        white-space: nowrap;
      }

      .breadcrumb li {
        max-width: none;
        white-space: nowrap;
        overflow: visible;
        text-overflow: clip;
      }
    }

    @media (min-width: 1024px) {
      .breadcrumb {
        font-size: 14px;
        padding: 8px 20px;
        max-width: 70%;
        top: var(--breadcrumb-top-desktop);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }
    }

    @media (min-width: 768px) and (max-width: 1023px) {
      .breadcrumb {
        top: var(--breadcrumb-top-base);
        flex-wrap: nowrap;
        white-space: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
      }

      .breadcrumb li,
      .breadcrumb a,
      .breadcrumb span {
        white-space: nowrap;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
  @Input() variant: 'default' | 'category' = 'default';
}
