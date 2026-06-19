import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface SeoTag {
  name?: string;
  property?: string;
  content: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  tags?: SeoTag[];
  canonicalPath?: string;
  jsonLd?: object | null;
  robots?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly titleSuffix = 'Hypermarket';
  private readonly jsonLdSelector = 'script[data-seo-json-ld="true"]';

  applySeo(config: SeoConfig): void {
    this.setTitle(config.title);
    this.setDescription(config.description);
    this.setTags(config.tags ?? []);
    this.setCanonical(config.canonicalPath);
    this.setRobots(config.robots);
    this.setJsonLd(config.jsonLd ?? null);
  }

  setTitle(title: string, useTemplate = true): void {
    const trimmedTitle = title.trim();
    const nextTitle = useTemplate && trimmedTitle !== this.titleSuffix
      ? `${trimmedTitle} | ${this.titleSuffix}`
      : trimmedTitle;

    this.title.setTitle(nextTitle || this.titleSuffix);
  }

  setDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
  }

  setTags(tags: SeoTag[]): void {
    for (const tag of tags) {
      if (tag.name) {
        this.meta.updateTag({ name: tag.name, content: tag.content });
      }

      if (tag.property) {
        this.meta.updateTag({ property: tag.property, content: tag.content });
      }
    }
  }

  setCanonical(path?: string): void {
    const href = this.absoluteUrl(path ?? this.router.url);
    let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', href);
  }

  setJsonLd(schema: object | null): void {
    this.clearJsonLd();

    if (!schema) {
      return;
    }

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-json-ld', 'true');
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  clearJsonLd(): void {
    this.document.querySelectorAll(this.jsonLdSelector).forEach(script => script.remove());
  }

  absoluteUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const origin = this.document.location?.origin ?? '';
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${origin}${normalizedPath}`;
  }

  private setRobots(robots?: string): void {
    if (robots) {
      this.meta.updateTag({ name: 'robots', content: robots });
      return;
    }

    this.meta.removeTag('name="robots"');
  }
}
