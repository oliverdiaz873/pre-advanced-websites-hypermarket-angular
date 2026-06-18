import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../../../shared/components/icons/icons.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, TranslatePipe, IconComponent],
  template: `
    <footer class="footer-global">
      <div class="footer-content">
        <small>&copy; {{ currentYear }} {{ 'footer.company_name' | translate }}. {{ 'footer.rights_reserved' | translate }}</small>

        <div class="social-icons">
          <a href="#" target="_blank" rel="nofollow noopener noreferrer"
             [attr.aria-label]="'footer.social.facebook' | translate"
             class="social-link" title="Facebook">
            <app-icon name="facebook" className="w-6 h-6 md:w-7 md:h-7"></app-icon>
          </a>
          <a href="#" target="_blank" rel="nofollow noopener noreferrer"
             [attr.aria-label]="'footer.social.x' | translate"
             class="social-link" title="X (Twitter)">
            <app-icon name="x-twitter" className="w-6 h-6 md:w-7 md:h-7"></app-icon>
          </a>
          <a href="#" target="_blank" rel="nofollow noopener noreferrer"
             [attr.aria-label]="'footer.social.instagram' | translate"
             class="social-link" title="Instagram">
            <app-icon name="instagram" className="w-6 h-6 md:w-7 md:h-7"></app-icon>
          </a>
        </div>

        <div class="footer-links">
          <a routerLink="/legal/privacy" [title]="'footer.links.privacy' | translate">
            {{ 'footer.links.privacy' | translate }}
          </a>
          <span class="separator">|</span>
          <a routerLink="/legal/terms" [title]="'footer.links.terms' | translate">
            {{ 'footer.links.terms' | translate }}
          </a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-global {
      background-color: rgba(0, 0, 0, 0.85);
      color: #fff;
      text-align: center;
      padding: 1.25rem 1.25rem;
    }

    .footer-content {
      width: 100%;
      max-width: 80rem;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .social-icons {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
    }

    .social-link {
      color: #fff;
      fill: #fff;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .social-link:hover {
      color: #fbbf24;
      fill: #fbbf24;
      transform: scale(1.25);
    }

    .social-link svg {
      width: 1.5rem;
      height: 1.5rem;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }

    .footer-links a {
      color: #d1d5db;
      text-decoration: none;
      transition: color 0.3s ease;
      margin: 0 0.5rem;
    }

    .footer-links a:hover {
      color: #fbbf24;
      text-decoration: underline;
    }

    .footer-links .separator {
      color: #6b7280;
    }

    @media (min-width: 768px) {
      .footer-global {
        padding: 1.5rem 2rem;
      }

      .footer-content {
        gap: 1.25rem;
      }

      .footer-content small {
        font-size: 14px;
      }

      .social-icons {
        gap: 1.75rem;
      }

      .social-link svg {
        width: 1.75rem;
        height: 1.75rem;
      }
    }
  `]
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
