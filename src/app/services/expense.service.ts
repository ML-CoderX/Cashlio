import { Injectable } from '@angular/core';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private storageKey = 'cashlio_expenses';

  constructor() {}

  private getAllExpenses(): Expense[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveAllExpenses(expenses: Expense[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(expenses));
  }
  getExpensesByMonth(month: number, year: number) {
  const expenses = this.getExpenses();

  return expenses.filter(e => {
    const date = new Date(e.date);
    return date.getMonth() === month &&
           date.getFullYear() === year;
  });
}
  getExpenses(): Expense[] {
    const activeProfile = localStorage.getItem('cashlio_active_profile');
    if (!activeProfile) return [];

    const allExpenses = this.getAllExpenses();

    return allExpenses.filter(
      e => e.profileId === Number(activeProfile)
    );
  }

  addExpense(expense: Expense) {
    const allExpenses = this.getAllExpenses();
    allExpenses.push(expense);
    this.saveAllExpenses(allExpenses);
  }

  deleteExpense(id: number) {
    const allExpenses = this.getAllExpenses();
    const updated = allExpenses.filter(e => e.id !== id);
    this.saveAllExpenses(updated);
  }

  getSummary() {
    const expenses = this.getExpenses();

    let income = 0;
    let expenseTotal = 0;

    expenses.forEach(e => {
      if (e.type === 'credit') income += e.amount;
      else expenseTotal += e.amount;
    });

    return {
      income,
      expense: expenseTotal,
      balance: income - expenseTotal
    };
  }
}