import { test, expect } from "../../fixtures";
import bookingData from "../../test-data/booking-data.json";

test.describe('test GET responses for bookings', () => {
  let bookingId: string;
  
  test.beforeAll(async ({ bookingClient }) => {
    bookingId = await bookingClient.postBooking(bookingData.bookingPayload);
  });

  test.afterAll(async ({ bookingClient }) => {
    if (bookingId) {
     await bookingClient.deleteBooking(bookingId);
    }
  });
  
  test('Should get particular booking ID', async ({ bookingClient }) => {
    const response = await bookingClient.getBooking(bookingId);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject(bookingData.bookingPayload);
  });

  test('Should throw a not found error', async ({ bookingClient }) => {
    const fakeId = `invalid-${Date.now()}`;
    const response = await bookingClient.getBooking(fakeId);
    expect(response.status()).toBe(404);
    const errorBody = await response.text();
    expect(errorBody).toContain("Not Found");
  });
});