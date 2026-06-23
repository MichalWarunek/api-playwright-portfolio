import { test, expect } from "../../fixtures";
import bookingData from "../../test-data/booking-data.json";


test.describe('test login responses for bookings', () => {
  test('Should get token correctly', async ({ bookingClient }) => {
    const response = await bookingClient.login();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
  });

  test('Should show error message', async ({ bookingClient }) => {
    const response = await bookingClient.login(bookingData.invalidLogin);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({reason: 'Bad credentials'});
  });
});