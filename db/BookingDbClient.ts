import { db } from '../helpers/dbHelper';

export interface BookingInterface {
  firstname: string,
  lastname: string,
  totalprice: number,
  depositpaid: boolean,
  bookingdates: {
  checkin: string, 
  checkout: string
  },
  additionalneeds: string
}

export class BookingDbClient {
 

    async deleteFromDb(id: number) {
      if (id) {
        const result = await db.run('DELETE FROM bookings WHERE id = ?', [id]);
        return result;
      }
    }
    async selectFromDb(id: number) {
      if (id) {
       const dbRow = await db.get('SELECT * FROM bookings WHERE id = ?', [id]);
       return dbRow;
      }
    }

    async selectBookingsWithPayment(ids: number[]) {
      if (ids.length === 0) return []; 
        const placeholders = ids.map(() => '?').join(',');
        const dbRows = await db.all(`SELECT b.*, p.id as paymentid, p.amount, p.paymentmethod, p.status, p.createdat FROM bookings b INNER JOIN payments p ON b.id = p.bookingid WHERE b.id IN (${placeholders})`, ids);
        return dbRows;
    }

    async selectAllBookingsAndPayments() {
        const dbRows = await db.all('SELECT b.*, p.id as paymentid, p.amount, p.paymentmethod, p.status, p.createdat FROM bookings b LEFT JOIN payments p ON b.id = p.bookingid');
        return dbRows;
    }

    async selectAllPaymentsAndBookings() {
      const dbRows = await db.all('SELECT b.*, p.id as paymentid, p.amount, p.paymentmethod, p.status, p.createdat FROM payments p LEFT JOIN bookings b ON  p.bookingid = b.id');
      return dbRows;
  }

    async updateFromDb(id: number , payload: BookingInterface) {
      if (id) {
       const dbRow = await db.run('UPDATE bookings SET firstname=?, lastname=?, totalprice=?, depositpaid=?, checkin=?, checkout=?, additionalneeds=?  WHERE id = ?', [payload.firstname, payload.lastname, payload.totalprice, payload.depositpaid, payload.bookingdates.checkin, payload.bookingdates.checkout, payload.additionalneeds, id]);
       return dbRow;
      }
    }

  

    async insertBooking(payload: BookingInterface) {
      const result = await db.run(
        'INSERT INTO bookings (firstname, lastname, totalprice, depositpaid, checkin, checkout, additionalneeds) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [payload.firstname, payload.lastname, payload.totalprice, payload.depositpaid, payload.bookingdates?.checkin, payload.bookingdates?.checkout, payload.additionalneeds]
      );
      return result.lastID!;

    }
}