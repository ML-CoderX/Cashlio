import { CommonModule, formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RouterModule } from '@angular/router';
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
  private alertCtrl = inject(AlertController);

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
    async downloadPdf() {
    if (this.expenses.length === 0) {
      const alert = await this.alertCtrl.create({
        header: 'No Data',
        message: 'No expenses available to download.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const sortedExpenses = [...this.expenseService.getExpenses()].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id
    );

    let runningBalance = 0;
    const rows = sortedExpenses.map((expense) => {
      runningBalance += expense.type === 'credit' ? expense.amount : -expense.amount;

      return [
        formatDate(expense.date, 'yyyy-MM-dd', 'en-IN'),
        expense.type === 'credit' ? 'Credit' : 'Debit',
        `₹ ${expense.amount.toFixed(2)}`,
        `₹ ${runningBalance.toFixed(2)}`
      ];
    });

    const doc = new jsPDF({ orientation: 'portrait' });
    doc.setFontSize(14);
    doc.text(`Expense History - ${this.activeProfileName || 'Profile'}`, 14, 16);

    autoTable(doc, {
      startY: 22,
      head: [['Date', 'Credit or Debit', 'Amount', 'Balance']],
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [51, 102, 204] }
    });

    doc.save(`expense-history-${this.activeProfileName || 'profile'}.pdf`);
  }
}
