import { test, expect } from "../../fixtures";

test.describe('test GET responses for bookings', () => {
  test('Should get particular booking id', async ({ bookingClient }) => {
    const response = await bookingClient.getBooking('5');
    expect(response.status()).toBe(200);
    const body = await response.json();
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