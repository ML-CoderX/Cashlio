import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Expense } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './history.page.html'
})
export class HistoryPage {
  private expenseService = inject(ExpenseService);
  private profileService = inject(ProfileService);

  expenses: Expense[] = [];
  activeProfileName = '';

  ionViewWillEnter() {
    this.loadExpenses();
    this.loadProfileName();
  }

  private loadExpenses() {
    this.expenses = this.expenseService.getExpenses().reverse();
  }

  private loadProfileName() {
    const profiles = this.profileService.getProfiles();
    const activeId = this.profileService.getActiveProfile();
    const profile = profiles.find((p) => p.id === activeId);
    this.activeProfileName = profile?.name || '';
  }

  deleteExpense(id: number) {
    this.expenseService.deleteExpense(id);
    this.loadExpenses();
  }
}
