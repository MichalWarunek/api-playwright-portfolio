import { Database } from "sqlite";
import { test, expect } from "../../fixtures";
import { db } from '../../helpers/dbHelper';
import bookingData from "../../test-data/booking-data.json";

test.describe('Test Select Booking Record', () => {
 let database: Database;
 let createdId: number;
 
 
 test.beforeAll(async () => {
    database = await db.init();
  });


  test.afterAll(async ({bookingDbClient}) => {
    await bookingDbClient.deleteFromDb(createdId); 
    await db.close();
  });

  test('Should create a booking via SQL and store in local SQLite', async () => {
    const payload = bookingData.bookingPayload;
 
    const result = await database.run(
      'INSERT INTO bookings (firstname, lastname, totalprice, depositpaid) VALUES (?, ?, ?, ?)',
      [payload.firstname, payload.lastname, payload.totalprice, payload.depositpaid]
    );
    createdId = result.lastID!;


    const dbRow = await database.get('SELECT * FROM bookings WHERE id = ?', [createdId]);
    expect(dbRow).toBeDefined();
    expect(dbRow.id).toBe(createdId);
    expect(dbRow.firstname).toBe(payload.firstname);
    expect(dbRow.lastname).toBe(payload.lastname);
    expect(dbRow.totalprice).toBe(payload.totalprice);
    expect(Boolean(dbRow.depositpaid)).toBe(payload.depositpaid);
  });
});