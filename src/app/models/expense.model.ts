export interface Expense {
  id: number;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  note: string;
  date: string;
  profileId: number;
}