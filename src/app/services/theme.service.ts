import { Injectable } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'cashlio_theme';
  private readonly darkThemeClass = 'ion-palette-dark';

  initTheme() {
    const savedTheme = this.getTheme();
    this.applyTheme(savedTheme);
  }

  getTheme(): AppTheme {
    const savedTheme = localStorage.getItem(this.storageKey);
    return savedTheme === 'light' ? 'light' : 'dark';
  }

  setTheme(theme: AppTheme) {
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: AppTheme) {
    document.body.classList.toggle(this.darkThemeClass, theme === 'dark');
  }
}

