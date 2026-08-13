import { test, expect } from "../../fixtures";
import bookingData from "../../test-data/booking-data.json";

test.describe('test POST responses for bookings @API', () => {
    let createdBookingId: string;
    
    test.afterEach(async ({ bookingClient }) => {
        if (createdBookingId) {
            await bookingClient.deleteBooking(createdBookingId);
           }
      });

  test('Should create new booking correctly', async ({ bookingClient, allure }) => {
    await allure.story("Successful booking creation");
    const response = await bookingClient.postBookingRaw(bookingData.bookingPayload);
    expect(response.status()).toBe(200);
    const body = await response.json();
    createdBookingId = body.bookingid;
    expect(body.booking).toMatchObject(bookingData.bookingPayload);
  });
});