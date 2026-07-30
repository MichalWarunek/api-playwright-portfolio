import { test, expect, BookingInterface } from "../../../fixtures";
import bookingData from "../../../test-data/booking-data.json";

test.describe('Test Select Booking Record', () => {
 
 let payload: BookingInterface;
 let createdId: number;
 
 
 test.beforeAll(async ({bookingDbClient}) => {
    payload = bookingData.bookingPayload;
    createdId = await bookingDbClient.insertBooking(payload);
  });


  test.afterAll(async ({bookingDbClient}) => {
    await bookingDbClient.deleteFromDb(createdId); 
  });

  test('Should UPDATE existing booking from local SQLite', async ({bookingDbClient}) => {
    await bookingDbClient.updateFromDb(createdId, bookingData.bookingUpdate);
    const dbRow = await bookingDbClient.selectFromDb(createdId);
    expect(dbRow).toBeDefined();
    expect(dbRow.id).toBe(createdId);
    expect(dbRow.firstname).toBe(bookingData.bookingUpdate.firstname);
    expect(dbRow.lastname).toBe(bookingData.bookingUpdate.lastname);
    expect(dbRow.totalprice).toBe(bookingData.bookingUpdate.totalprice);
    expect(Boolean(dbRow.depositpaid)).toBe(bookingData.bookingUpdate.depositpaid);
    expect(dbRow.checkin).toBe(bookingData.bookingUpdate.bookingdates.checkin);
    expect(dbRow.checkout).toBe(bookingData.bookingUpdate.bookingdates.checkout);
    expect(dbRow.additionalneeds).toBe(bookingData.bookingUpdate.additionalneeds);
  });

  test('Should UPDATE not existing booking from local SQLite', async ({bookingDbClient}) => {
    const nonExistingId = 9999;
    const result = await bookingDbClient.updateFromDb(nonExistingId, bookingData.bookingUpdate);
    expect(result?.changes).toBe(0);
  });
});