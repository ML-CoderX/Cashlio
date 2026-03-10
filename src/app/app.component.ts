import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ProfileService } from './services/profile.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, RouterModule],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `
})
export class AppComponent {
  private profileService = inject(ProfileService);
  private themeService = inject(ThemeService);

  constructor() {
    this.profileService.initDefaultProfile();
    this.themeService.initTheme();
  }
}
