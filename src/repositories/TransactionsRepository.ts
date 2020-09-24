import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {

  public async getBalance(): Promise<Balance> {
    const transactions = await this.find(); //Devido estar no repositório, já busca no BD
    const { income, outcome } = transactions.reduce((acc: Balance, transaction: Transaction) => {
      switch(transaction.type) {
        case "income":
          acc.income += Number(transaction.value);
          break;
        case "outcome":
          acc.outcome += Number(transaction.value);
          break;
      }
      return acc;
    }, {
      income: 0,
      outcome: 0,
      total: 0
    });

    /*const { income, outcome } = transactions.reduce((acc, transaction) => {
      switch(transaction.type) {
        case "income":
          acc.income += Number(transaction.value);
          break;
        case "outcome":
          acc.outcome += Number(transaction.value);
          break;
      }
      return acc;
    }, {
      income: 0,
      outcome: 0,
      total: 0
    });    */
  
    const total = income - outcome;
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
