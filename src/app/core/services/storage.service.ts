import { Injectable, inject } from '@angular/core';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private platform = inject(PlatformService);

  get<T = string>(key: string): T | null {
    if (!this.platform.isBrowser()) {
      return null;
    }
    const value = localStorage.getItem(key);
    if (value === null) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.platform.isBrowser()) {
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    if (!this.platform.isBrowser()) {
      return;
    }
    localStorage.removeItem(key);
  }
}
