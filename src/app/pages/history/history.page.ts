import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { ProfileService } from '../../services/profile.service';
import { Expense } from '../../models/expense.model';
import { RouterModule } from '@angular/router';
  
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './history.page.html',
})
export class HistoryPage {

  expenses: Expense[] = [];
  activeProfileName = '';

  constructor(
    private expenseService: ExpenseService,
    private profileService: ProfileService
  ) {}

  ionViewWillEnter() {
    this.loadExpenses();
    this.loadProfileName();
  }

  loadExpenses() {
    this.expenses = this.expenseService.getExpenses().reverse();
  }

  loadProfileName() {
    const profiles = this.profileService.getProfiles();
    const activeId = this.profileService.getActiveProfile();
    const profile = profiles.find(p => p.id === activeId);
    this.activeProfileName = profile?.name || '';
  }

  deleteExpense(id: number) {
    this.expenseService.deleteExpense(id);
    this.loadExpenses();
  }
}