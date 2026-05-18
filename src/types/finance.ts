export type TransactionType = 'COD Collection' | 'Prepaid' | 'Expense' | 'Supplier Payment' | 'Rider Payout';

export interface FinanceEntry {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  relatedOrder?: string;
  relatedRider?: string;
  date: string;
  createdBy: string;
}