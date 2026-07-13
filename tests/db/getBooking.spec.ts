import { test, expect } from "../../fixtures";
import { db } from '../../helpers/dbHelper';
import bookingData from "../../test-data/booking-data.json";

test.describe('Test Select Booking Record', () => {
 let database: any;
 let randomId: number;
 
 
 test.beforeAll(async () => {
    database = await db.init();
  });


  test.afterAll(async ({bookingDbClient}) => {
    await bookingDbClient.deleteFromDb(randomId); 
    await db.close();
  });

  test('Should create a booking via SQL and store in local SQLite', async () => {
    const payload = bookingData.bookingPayload;
    randomId = Date.now();
 
    await database.run(
      'INSERT INTO bookings (id, firstname, lastname, totalprice, depositpaid) VALUES (?, ?, ?, ?, ?)',
      [randomId, payload.firstname, payload.lastname, payload.totalprice, payload.depositpaid]
    );

    const dbRow = await database.get('SELECT * FROM bookings WHERE id = ?', [randomId]);
    expect(dbRow).toBeDefined();
    expect(dbRow.firstname).toBe(payload.firstname);
    expect(dbRow.lastname).toBe(payload.lastname);
    expect(dbRow.totalprice).toBe(payload.totalprice);
    expect(Boolean(dbRow.depositpaid)).toBe(payload.depositpaid);
  });
});