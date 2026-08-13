import { test, expect, BookingInterface } from "../../../fixtures";
import bookingData from "../../../test-data/booking-data.json";

test.describe('Test Insert Booking Record @DB', () => {
 let payload: BookingInterface;
 let createdId: number;
 
  test.afterAll(async ({bookingDbClient}) => {
    await bookingDbClient.deleteFromDb(createdId); 
  });

  test('Should insert valid booking to the local SQLite', async ({bookingDbClient, allure}) => {
    await allure.story("Successful booking update");
    payload = bookingData.bookingPayload;
    createdId = await bookingDbClient.insertBooking(payload);
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

  test('Should throws SQLITE_CONSTRAINT while inserting invalid booking to the local SQLite', async ({bookingDbClient, allure}) => {
    await allure.story("Unsuccessful booking update with SQLITE_CONSTRAINT error");
    const invalidPayload = bookingData.invalidBookingPayload;
     await expect(async () => { 
        await bookingDbClient.insertBooking(invalidPayload as unknown as BookingInterface)}).rejects.toThrow('SQLITE_CONSTRAINT');
  });
});
