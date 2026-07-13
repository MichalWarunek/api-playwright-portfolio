import { db } from '../helpers/dbHelper';



export class BookingDbClient {
 

    async deleteFromDb(id: number) {
      if (id) {
        await db.run('DELETE FROM bookings WHERE id = ?', [id]);
      }
    }
}