import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';
import { AppTheme, ThemeService } from '../../services/theme.service';
import { Expense } from '../../models/expense.model';

interface CashlioBackup {
  version: 1;
  exportedAt: string;
  theme: AppTheme;
  activeProfileId: number | null;
  profiles: Profile[];
  expenses: Expense[];
}

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

  async exportBackup() {
    const backupData: CashlioBackup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      theme: this.themeService.getTheme(),
      activeProfileId: this.profileService.getActiveProfile(),
      profiles: this.profileService.getProfiles(),
      expenses: this.getAllExpenses()
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const fileName = `cashlio-backup-${backupData.exportedAt.slice(0, 10)}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);

    const alert = await this.alertCtrl.create({
      header: 'Backup Downloaded',
      message: 'Keep this backup JSON file safe. You can import it on your new phone to restore transactions and profiles.',
      buttons: ['OK']
    });

    await alert.present();
  }

  triggerImport(input: HTMLInputElement) {
    input.value = '';
    input.click();
  }

  async importBackup(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const fileText = await file.text();

    let parsed: CashlioBackup;

    try {
      parsed = JSON.parse(fileText) as CashlioBackup;
    } catch {
      await this.showImportError('Invalid backup file format.');
      return;
    }

    if (!this.isValidBackup(parsed)) {
      await this.showImportError('Backup file is missing required data.');
      return;
    }

    localStorage.setItem('cashlio_profiles', JSON.stringify(parsed.profiles));
    localStorage.setItem('cashlio_expenses', JSON.stringify(parsed.expenses));

    if (parsed.activeProfileId) {
      localStorage.setItem('cashlio_active_profile', parsed.activeProfileId.toString());
    }

    this.themeService.setTheme(parsed.theme);
    this.selectedTheme = parsed.theme;
    this.loadProfiles();

    const alert = await this.alertCtrl.create({
      header: 'Import Complete',
      message: 'Your backup has been restored successfully.',
      buttons: ['OK']
    });

    await alert.present();
  }

  private isValidBackup(data: any): data is CashlioBackup {
    return (
      data &&
      data.version === 1 &&
      Array.isArray(data.profiles) &&
      Array.isArray(data.expenses) &&
      (data.theme === 'dark' || data.theme === 'light')
    );
  }

  private getAllExpenses(): Expense[] {
    const data = localStorage.getItem('cashlio_expenses');
    return data ? JSON.parse(data) : [];
  }

  private async showImportError(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Import Failed',
      message,
      buttons: ['OK']
    });

    await alert.present();
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
