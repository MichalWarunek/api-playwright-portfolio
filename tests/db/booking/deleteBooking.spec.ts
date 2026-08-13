import { test, expect, BookingInterface } from "../../../fixtures";
import bookingData from "../../../test-data/booking-data.json";

test.describe('Test Delete Booking Record @DB', () => {
 
 let payload: BookingInterface;
 let createdId: number;
 
 
 test.beforeAll(async ({bookingDbClient}) => {
    payload = bookingData.bookingPayload;
    createdId = await bookingDbClient.insertBooking(payload);
  });


  test('Should DELETE existing booking from local SQLite', async ({bookingDbClient, allure}) => {
    await allure.story("Successful booking deletion");
    await bookingDbClient.deleteFromDb(createdId);
    const dbRow = await bookingDbClient.selectFromDb(createdId);
    expect(dbRow).toBeUndefined();
  });

  test('Should DELETE not existing booking from local SQLite', async ({bookingDbClient, allure}) => {
    await allure.story("Unsuccessful booking deletion with invalid ID");
    const nonExistingId = 9999;
    const result = await bookingDbClient.deleteFromDb(nonExistingId);
    expect(result?.changes).toBe(0);
  });
});