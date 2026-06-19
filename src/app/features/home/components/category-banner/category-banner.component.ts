import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getAssetUrl } from '@core/utils';

export interface CategoryBannerData {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  imageSrc: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
}

@Component({
  selector: 'app-category-banner',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a [routerLink]="data.href" class="category-banner-link">
      <div
        class="category-banner-card"
        [style]="{ '--gradient-from': data.gradientFrom, '--gradient-to': data.gradientTo, '--accent-color': data.accentColor }"
        [class.is-reversed]="reversed"
      >
        <div class="category-banner-bg"></div>
        <div class="category-banner-orb category-banner-orb--1"></div>
        <div class="category-banner-orb category-banner-orb--2"></div>

        <div class="category-banner-content" [class.is-reversed]="reversed">
          <div class="category-banner-text" [class.is-reversed]="reversed">
            <h3 class="category-banner-title">{{ data.title }}</h3>
            <p class="category-banner-description">{{ data.description }}</p>
            <div class="category-banner-cta-wrapper">
              <div class="category-banner-cta">
                <span>{{ data.buttonText }}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M5.5 3.5L10 8L5.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="category-banner-image-wrapper">
            <div class="category-banner-image-glow"></div>
            <div class="category-banner-image-container">
              <img
                [src]="getAssetUrl(data.imageSrc)"
                [alt]="data.title"
                class="category-banner-image"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </a>
  `,
  styles: [`
    .category-banner-link {
      display: block;
      text-decoration: none;
    }

    .category-banner-card {
      border-radius: 18px;
      padding: 1.25rem 1rem;
      min-height: 180px;
      isolation: isolate;
      border: 1px solid rgba(255,255,255,0.08);
      transition: all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
      position: relative;
      overflow: hidden;
    }

    .category-banner-card:hover {
      border-color: rgba(255,255,255,0.15);
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.25);
    }

    @media (min-width: 480px) {
      .category-banner-card { border-radius: 22px; }
    }

    @media (min-width: 768px) {
      .category-banner-card {
        border-radius: 28px;
        padding: 3rem 3.5rem;
        min-height: 360px;
      }
    }

    .category-banner-bg {
      position: absolute;
      inset: 0;
      z-index: -2;
      background: linear-gradient(135deg, var(--gradient-from), var(--gradient-to));
    }

    .category-banner-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.35;
      pointer-events: none;
    }

    .category-banner-orb--1 {
      width: 260px;
      height: 260px;
      background: var(--accent-color);
      top: -80px;
      right: -60px;
    }

    .category-banner-orb--2 {
      width: 200px;
      height: 200px;
      background: var(--gradient-from);
      bottom: -60px;
      left: -40px;
      opacity: 0.25;
    }

    .category-banner-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;
      position: relative;
      z-index: 1;
    }

    .category-banner-content.is-reversed {
      flex-direction: row-reverse;
    }

    @media (min-width: 768px) {
      .category-banner-content { gap: 3rem; }
    }

    .category-banner-text {
      flex: 1;
      text-align: left;
    }

    .category-banner-text.is-reversed {
      text-align: right;
      align-items: flex-end;
    }

    .category-banner-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.02em;
      margin: 0 0 0.25rem;
    }

    @media (min-width: 768px) {
      .category-banner-title { font-size: 1.4rem; }
    }

    .category-banner-description {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.75);
      max-width: 380px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin: 0 0 0.75rem;
      line-height: 1.4;
    }

    @media (min-width: 768px) {
      .category-banner-description {
        font-size: 0.85rem;
        -webkit-line-clamp: 4;
      }
    }

    .category-banner-cta-wrapper {
      display: flex;
    }

    .category-banner-text.is-reversed .category-banner-cta-wrapper {
      justify-content: flex-end;
    }

    .category-banner-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.45rem 1rem;
      font-size: 0.7rem;
      color: var(--gradient-from);
      background: rgba(255,255,255,0.95);
      border-radius: 100px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      font-weight: 600;
    }

    .category-banner-cta svg {
      transition: transform 0.3s ease;
    }

    .category-banner-card:hover .category-banner-cta {
      background: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }

    .category-banner-card:hover .category-banner-cta svg {
      transform: translateX(3px);
    }

    @media (min-width: 768px) {
      .category-banner-cta {
        padding: 0.75rem 1.75rem;
        font-size: 0.875rem;
      }
    }

    .category-banner-image-wrapper {
      flex-shrink: 0;
      width: 140px;
      height: 140px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: float 3.2s ease-in-out infinite;
    }

    @media (min-width: 480px) {
      .category-banner-image-wrapper {
        width: 180px;
        height: 180px;
      }
    }

    @media (min-width: 768px) {
      .category-banner-image-wrapper {
        width: 290px;
        height: 290px;
      }
    }

    .category-banner-image-glow {
      position: absolute;
      inset: -15%;
      border-radius: 50%;
      background: radial-gradient(circle, var(--accent-color), transparent 70%);
      opacity: 0.3;
      filter: blur(30px);
    }

    .category-banner-image-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .category-banner-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-12px) rotate(1.5deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .category-banner-card,
      .category-banner-card:hover,
      .category-banner-cta,
      .category-banner-cta svg,
      .category-banner-image-wrapper {
        transition: none;
        animation: none;
        transform: none;
      }
    }
  `]
})
export class CategoryBannerComponent {
  @Input({ required: true }) data!: CategoryBannerData;
  @Input() reversed = false;
  protected readonly getAssetUrl = getAssetUrl;
}
