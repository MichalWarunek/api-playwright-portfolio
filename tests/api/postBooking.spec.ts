import { test, expect } from "../../fixtures";
import bookingData from "../../test-data/booking-data.json";

test.describe('test POST responses for bookings', () => {
    let createdBookingId: string;
    let token: string;

    test.beforeAll(async ({ bookingClient }) => {
      token = await bookingClient.getToken();
    });
    
    test.afterEach(async ({ bookingClient }) => {
        if (createdBookingId) {
            await bookingClient.deleteBooking(createdBookingId, token);
           }
      });

  test('Should create new booking correctly', async ({ bookingClient }) => {
    const response = await bookingClient.postBookingRaw(bookingData.bookingPayload);
    expect(response.status()).toBe(200);
    const body = await response.json();
    createdBookingId = body.bookingid;
    expect(body.booking).toMatchObject(bookingData.bookingPayload);
  });
});