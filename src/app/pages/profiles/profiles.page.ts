import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './profiles.page.html'
})
export class ProfilesPage {
  private profileService = inject(ProfileService);
  private alertCtrl = inject(AlertController);

  profiles: Profile[] = [];
  activeProfile!: number;

  ionViewWillEnter() {
    this.loadProfiles();
  }

  private loadProfiles() {
    this.profiles = this.profileService.getProfiles();
    this.activeProfile = this.profileService.getActiveProfile()!;
  }

  switchProfile(id: number) {
    this.profileService.setActiveProfile(id);
    this.activeProfile = id;
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
