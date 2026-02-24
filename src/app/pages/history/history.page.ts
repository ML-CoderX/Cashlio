import { CommonModule, formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
        expense.category || '-',
        `₹ ${expense.amount.toFixed(2)}`,
        `₹ ${runningBalance.toFixed(2)}`
      ];
    });

    const doc = new jsPDF({ orientation: 'portrait' });
    doc.setFontSize(14);
    doc.text(`Expense History - ${this.activeProfileName || 'Profile'}`, 14, 16);

    autoTable(doc, {
      startY: 22,
      head: [['Date', 'Credit or Debit', 'Category', 'Amount', 'Balance']],
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [51, 102, 204] }
    });

    const fileName = this.getPdfFileName();

    try {
      const pdfBlob = doc.output('blob');
      await this.downloadOrSharePdf(pdfBlob, fileName);
    } catch {
      doc.save(fileName);
    }
  }

  private getPdfFileName(): string {
    const rawName = this.activeProfileName || 'profile';
    const safeName = rawName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return `expense-history-${safeName || 'profile'}.pdf`;
  }

  private async downloadOrSharePdf(pdfBlob: Blob, fileName: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
      const canShareFiles =
        typeof navigator.canShare === 'function' && navigator.canShare({ files: [pdfFile] });

      if (typeof navigator.share === 'function' && canShareFiles) {
        await navigator.share({
          title: fileName,
          text: 'Cashlio expense history',
          files: [pdfFile]
        });
        return;
      }
    }

    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener';

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1000);
  }
}
