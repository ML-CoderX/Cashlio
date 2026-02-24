import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ExpenseService } from '../../services/expense.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  private expenseService = inject(ExpenseService);
  private profileService = inject(ProfileService);

  income = 0;
  expense = 0;
  balance = 0;
  activeProfileName = '';

  ngOnInit() {
    this.loadSummary();
    this.loadProfileName();
  }

  private loadSummary() {
    const summary = this.expenseService.getSummary();
    this.income = summary.income;
    this.expense = summary.expense;
    this.balance = summary.balance;
  }

  private loadProfileName() {
    const profiles = this.profileService.getProfiles();
    const activeId = this.profileService.getActiveProfile();
    const profile = profiles.find((p) => p.id === activeId);
    this.activeProfileName = profile?.name || '';
  }
}
