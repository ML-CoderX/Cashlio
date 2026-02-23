import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {

  activeProfileName = '';

  constructor(private profileService: ProfileService) {}

  ionViewWillEnter() {
    this.loadProfile();
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const profiles = this.profileService.getProfiles();
    const activeId = this.profileService.getActiveProfile();
    const profile = profiles.find(p => p.id === activeId);
    this.activeProfileName = profile?.name || '';
  }
}