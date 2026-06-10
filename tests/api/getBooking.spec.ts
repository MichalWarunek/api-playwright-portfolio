import { test, expect } from "../../fixtures";
import bookingData from "../../test-data/booking-data.json";

test.describe('test GET responses for bookings', () => {
  let bookingId: string;
  
  test.beforeAll(async ({bookingClient}) => {
    bookingId = await bookingClient.postBooking(bookingData.bookingPayload);
  });

  
  test('Should get particular booking id', async ({ bookingClient }) => {
    const response = await bookingClient.getBooking(bookingId);
    expect(response.status()).toBe(200);
    const body = await response.json();
    console.log(body)
    expect(body).toMatchObject({
        firstname: expect.any(String),
        lastname: expect.any(String),
        depositpaid: expect.any(Boolean),
        totalprice: expect.any(Number),
        bookingdates: {
            checkin: expect.any(String),
            checkout: expect.any(String)
        }
      });
  });
});