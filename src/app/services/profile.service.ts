import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private storageKey = 'cashlio_profiles';
  private activeKey = 'cashlio_active_profile';
  initDefaultProfile() {
  const profiles = this.getProfiles();

  if (profiles.length === 0) {
    const defaultProfile = {
      id: Date.now(),
      name: 'My Profile'
    };

    this.saveProfiles([defaultProfile]);
    this.setActiveProfile(defaultProfile.id);
  }
}
  getProfiles(): Profile[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveProfiles(profiles: Profile[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(profiles));
  }

  addProfile(name: string) {
    const profiles = this.getProfiles();
    profiles.push({
      id: Date.now(),
      name
    });
    this.saveProfiles(profiles);
  }

  setActiveProfile(profileId: number) {
    localStorage.setItem(this.activeKey, profileId.toString());
  }

  getActiveProfile(): number | null {
    const id = localStorage.getItem(this.activeKey);
    return id ? Number(id) : null;
  }
}

export { Profile };
