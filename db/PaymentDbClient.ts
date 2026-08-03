import { db } from '../helpers/dbHelper';

export interface PaymentInterface {
  bookingid: number,
  amount: number,
  paymentmethod: string,
  status: string,
  createdat: string
}

export class PaymentDbClient {
    async deleteFromDb(id: number) {
      if (id) {
        const result = await db.run('DELETE FROM payments WHERE id = ?', [id]);
        return result;
      }
    }
    async selectFromDb(id: number) {
      if (id) {
       const dbRow = await db.get('SELECT * FROM payments WHERE id = ?', [id]);
       return dbRow;
      }
    }

    async insertPayment(payload: PaymentInterface, bookingId: number) {
      const result = await db.run(
        'INSERT INTO payments (bookingid, amount, paymentmethod, status, createdat) VALUES (?, ?, ?, ?, ?)',
        [bookingId, payload.amount, payload.paymentmethod, payload.status, payload.createdat]
      );
      return result.lastID!;

    }
}