import { Database } from "sqlite";
import { test, expect, BookingInterface } from "../../fixtures";
import { db } from '../../helpers/dbHelper';
import bookingData from "../../test-data/booking-data.json";

test.describe('Test Select Booking Record', () => {
 let database: Database;
 let payload: BookingInterface;
 let createdId: number;
 
 
 test.beforeAll(async ({bookingDbClient}) => {
    database = await db.init();
    payload = bookingData.bookingPayload;
    createdId = await bookingDbClient.insertBooking(payload);
  });


  test.afterAll(async ({bookingDbClient}) => {
    await bookingDbClient.deleteFromDb(createdId); 
    await db.close();
  });

  test('Should SELECT existing booking from local SQLite', async ({bookingDbClient}) => {
    const dbRow = await bookingDbClient.selectFromDb(createdId);
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

  test('Should SELECT non-existing booking from local SQLite', async ({bookingDbClient}) => {
    const nonExistingId = 9999;
    const dbRow = await bookingDbClient.selectFromDb(nonExistingId);
    expect(dbRow).toBeUndefined();
  });
});