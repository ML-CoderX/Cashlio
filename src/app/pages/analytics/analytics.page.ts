import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Chart } from 'chart.js/auto';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './analytics.page.html',
  styleUrl: './analytics.page.scss'
})
export class AnalyticsPage implements AfterViewInit, OnDestroy {
  private expenseService = inject(ExpenseService);

  private barChart?: Chart;
  private pieChart?: Chart;

  ngAfterViewInit() {
    this.createCharts();
  }

  ionViewWillEnter() {
    this.createCharts();
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  private createCharts() {
    const expenses = this.expenseService.getExpenses();
    this.destroyCharts();

    const computedStyles = getComputedStyle(document.body);
    const isDark = document.body.classList.contains('ion-palette-dark');
    const textColor = computedStyles.getPropertyValue('--ion-text-color').trim() || (isDark ? '#eef3ff' : '#122246');
    const gridColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(18,40,84,0.18)';

    const income = expenses
      .filter((e) => e.type === 'credit')
      .reduce((sum, e) => sum + e.amount, 0);

    const expenseTotal = expenses
      .filter((e) => e.type === 'debit')
      .reduce((sum, e) => sum + e.amount, 0);

    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Income', 'Expense'],
        datasets: [{
          label: 'Amount',
          data: [income, expenseTotal],
          backgroundColor: ['#2acb93', '#ff647c']
        }]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: { color: textColor },
            grid: { color: gridColor }
          },
          y: {
            ticks: { color: textColor },
            grid: { color: gridColor }
          }
        }
      }
    });

    const categoryMap: Record<string, number> = {};

    expenses
      .filter((e) => e.type === 'debit')
      .forEach((e) => {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
      });

    this.pieChart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: Object.keys(categoryMap),
        datasets: [{
          data: Object.values(categoryMap)
        }]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        }
      }
    });
  }

  private destroyCharts() {
    this.barChart?.destroy();
    this.pieChart?.destroy();
    this.barChart = undefined;
    this.pieChart = undefined;
  }
}
