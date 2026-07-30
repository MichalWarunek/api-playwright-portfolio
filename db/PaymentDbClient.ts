import { db } from '../helpers/dbHelper';

export interface PaymentInterface {
  booking_id: number,
  amount: number,
  payment_method: string,
  status: string,
  created_at: string
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
        'INSERT INTO payments (booking_id, amount, payment_method, status, created_at) VALUES (?, ?, ?, ?, ?)',
        [bookingId, payload.amount, payload.payment_method, payload.status, payload.created_at]
      );
      return result.lastID!;

    }
}