import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ExpenseService } from '../../services/expense.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss']
})
export class AddExpensePage {
  private expenseService = inject(ExpenseService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  amount!: number;
  type: 'credit' | 'debit' = 'debit';
  category = '';
  note = '';
  date = new Date().toISOString();
  activeProfileName = '';

  ionViewWillEnter() {
    this.loadProfileName();
  }

  private loadProfileName() {
    const profiles = this.profileService.getProfiles();
    const activeId = this.profileService.getActiveProfile();
    const profile = profiles.find((p) => p.id === activeId);
    this.activeProfileName = profile?.name || '';
  }

  saveExpense() {
    const activeProfile = this.profileService.getActiveProfile();
    if (!activeProfile) return;

    const newExpense = {
      id: Date.now(),
      amount: this.amount,
      type: this.type,
      category: this.category,
      note: this.note,
      date: this.date,
      profileId: activeProfile
    };

    this.expenseService.addExpense(newExpense);
    this.router.navigate(['/tabs/dashboard']);
  }
}
