import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';
import { AppTheme, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './profiles.page.html',
  styleUrl: './profiles.page.scss'
})
export class ProfilesPage {
  private profileService = inject(ProfileService);
  private alertCtrl = inject(AlertController);
  private themeService = inject(ThemeService);

  profiles: Profile[] = [];
  activeProfile!: number;
  selectedTheme: AppTheme = 'dark';

  ionViewWillEnter() {
    this.loadProfiles();
    this.selectedTheme = this.themeService.getTheme();
  }

  private loadProfiles() {
    this.profiles = this.profileService.getProfiles();
    this.activeProfile = this.profileService.getActiveProfile()!;
  }

  switchProfile(id: number) {
    this.profileService.setActiveProfile(id);
    this.activeProfile = id;
  }

  onThemeChange(theme: string | number | null | undefined) {
    const nextTheme: AppTheme = theme === 'light' ? 'light' : 'dark';
    this.selectedTheme = nextTheme;
    this.themeService.setTheme(nextTheme);
  }

  async addProfile() {
    const alert = await this.alertCtrl.create({
      header: 'New Profile',
      inputs: [{ name: 'name', placeholder: 'Profile Name' }],
      buttons: [
        'Cancel',
        {
          text: 'Add',
          handler: (data) => {
            if (data.name) {
              this.profileService.addProfile(data.name);
              this.loadProfiles();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async renameProfile(profile: Profile) {
    const alert = await this.alertCtrl.create({
      header: 'Rename Profile',
      inputs: [{ name: 'name', value: profile.name }],
      buttons: [
        'Cancel',
        {
          text: 'Save',
          handler: (data) => {
            profile.name = data.name;
            this.profileService.saveProfiles(this.profiles);
            this.loadProfiles();
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteProfile(profile: Profile) {
    const allExpenses = localStorage.getItem('cashlio_expenses');
    const expenses = allExpenses ? JSON.parse(allExpenses) : [];

    const hasExpenses = expenses.some(
      (e: any) => e.profileId === profile.id
    );

    const alert = await this.alertCtrl.create({
      header: 'Delete Profile?',
      message: hasExpenses
        ? 'This profile has expenses. Are you sure you want to delete it?'
        : 'Are you sure you want to delete this profile?',
      buttons: [
        'Cancel',
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            const updated = this.profiles.filter((p) => p.id !== profile.id);
            this.profileService.saveProfiles(updated);

            if (this.activeProfile === profile.id && updated.length > 0) {
              this.profileService.setActiveProfile(updated[0].id);
            }

            this.loadProfiles();
          }
        }
      ]
    });

    await alert.present();
  }
}
