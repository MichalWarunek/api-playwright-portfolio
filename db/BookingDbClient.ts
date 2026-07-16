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
        await db.run('DELETE FROM bookings WHERE id = ?', [id]);
      }
    }
    async selectFromDb(id: number) {
      if (id) {
       const dbRow = await db.get('SELECT * FROM bookings WHERE id = ?', [id]);
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