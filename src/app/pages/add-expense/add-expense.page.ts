import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { ProfileService } from '../../services/profile.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss']
})
export class AddExpensePage {

  amount!: number;
  type: 'credit' | 'debit' = 'debit';
  category = '';
  note = '';
  date = new Date().toISOString();
  activeProfileName = '';

  constructor(
    private expenseService: ExpenseService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.loadProfileName();
  }

  loadProfileName() {
    const profiles = this.profileService.getProfiles();
    const activeId = this.profileService.getActiveProfile();
    const profile = profiles.find(p => p.id === activeId);
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
    this.router.navigate(['/dashboard']);
  }
}