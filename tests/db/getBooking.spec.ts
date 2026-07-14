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

  test('Should create a booking via SQL and store in local SQLite', async ({bookingDbClient}) => {
    const payload = bookingData.bookingPayload;
    createdId = await bookingDbClient.insertBooking(payload);


    const dbRow = await database.get('SELECT * FROM bookings WHERE id = ?', [createdId]);
    expect(dbRow).toBeDefined();
    expect(dbRow.id).toBe(createdId);
    expect(dbRow.firstname).toBe(payload.firstname);
    expect(dbRow.lastname).toBe(payload.lastname);
    expect(dbRow.totalprice).toBe(payload.totalprice);
    expect(Boolean(dbRow.depositpaid)).toBe(payload.depositpaid);
    expect(dbRow.checkin).toBe(payload.bookingdates.checkin);
    expect(dbRow.checkout).toBe(payload.bookingdates.checkout);
    expect(dbRow.additionalneeds).toBe(payload.additionalneeds);
  });
});