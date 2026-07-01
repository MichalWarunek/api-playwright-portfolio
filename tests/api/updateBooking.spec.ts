import { test, expect } from "../../fixtures";
import bookingData from "../../test-data/booking-data.json";

test.describe('test PUT responses for bookings', () => {
  let bookingId: string;
  let token: string;
  
  test.beforeAll(async ({ bookingClient }) => {
    bookingId = await bookingClient.postBooking(bookingData.bookingPayload);
    token = await bookingClient.getToken();
  });

  test.afterAll(async ({ bookingClient }) => {
    if (bookingId) {
     await bookingClient.deleteBooking(bookingId, token);
    }
  });
  
  test('Should update particular booking ID', async ({ bookingClient }) => {
    const bookingPayload = await bookingClient.getBooking(bookingId);
    expect(bookingPayload.status()).toBe(200);
    const body = await bookingPayload.json();
    expect(body).toMatchObject(bookingData.bookingPayload);
    const response = await bookingClient.updateBooking(bookingId, token, bookingData.bookingUpdate)
    expect(response.status()).toBe(200);
    const currentBooking = await response.json();
    expect(currentBooking).toMatchObject(bookingData.bookingUpdate);
  });
});