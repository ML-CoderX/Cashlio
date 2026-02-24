import { AfterViewInit, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Chart } from 'chart.js/auto';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './analytics.page.html'
})
export class AnalyticsPage implements AfterViewInit {
  private expenseService = inject(ExpenseService);

  ngAfterViewInit() {
    this.createCharts();
  }

  private createCharts() {
    const expenses = this.expenseService.getExpenses();

    const income = expenses
      .filter((e) => e.type === 'credit')
      .reduce((sum, e) => sum + e.amount, 0);

    const expenseTotal = expenses
      .filter((e) => e.type === 'debit')
      .reduce((sum, e) => sum + e.amount, 0);

    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Income', 'Expense'],
        datasets: [{
          label: 'Amount',
          data: [income, expenseTotal]
        }]
      }
    });

    const categoryMap: Record<string, number> = {};

    expenses
      .filter((e) => e.type === 'debit')
      .forEach((e) => {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
      });

    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: Object.keys(categoryMap),
        datasets: [{
          data: Object.values(categoryMap)
        }]
      }
    });
  }
}
