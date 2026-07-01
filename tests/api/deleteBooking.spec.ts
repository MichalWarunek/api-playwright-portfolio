import { test, expect } from "../../fixtures";
import bookingData from "../../test-data/booking-data.json";

test.describe('test DELETE responses for bookings', () => {
  let bookingId: string;
  let token: string;
  
  test.beforeEach(async ({ bookingClient }) => {
    bookingId = await bookingClient.postBooking(bookingData.bookingPayload);
    token = await bookingClient.getToken();
  });

  
  test('Should delete particular booking ID', async ({ bookingClient }) => {
    const response = await bookingClient.deleteBooking(bookingId, token);
    expect(response.status()).toBe(201);
    const deletedBooking = await bookingClient.getBooking(bookingId);
    expect(deletedBooking.status()).toBe(404);
  });

  test('Should throw an error if particular booking ID is invalid', async ({ bookingClient }) => {
    const response = await bookingClient.deleteBooking(bookingData.invalidBooking.id, token);
    expect(response.status()).toBe(405);
  });

  test('Should throw an error if user is not authorized', async ({ bookingClient }) => {
    const response = await bookingClient.deleteBooking(bookingId, bookingData.invalidToken.token);
    expect(response.status()).toBe(403);
  });
});