import { test, expect } from "../../fixtures";
import bookingData from "../../test-data/booking-data.json";


test.describe('test login responses for bookings @API', () => {
  test('Should get token correctly', async ({ bookingClient, allure }) => {
    await allure.story("Successful user authentication");
    const response = await bookingClient.login();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
  });

  test('Should show error message', async ({ bookingClient, allure }) => {
    await allure.story("User authentication fails with invalid credentials");
    const response = await bookingClient.login(bookingData.invalidLogin);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({reason: 'Bad credentials'});
  });
});