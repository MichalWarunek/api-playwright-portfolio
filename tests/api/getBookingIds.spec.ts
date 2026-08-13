import { test, expect } from "../../fixtures";

test.describe('test GET responses @API', () => {
  test('Should get all booking ids', async ({ bookingClient, allure }) => {
    await allure.story("Retrieve all booking IDs successfully");
    const response = await bookingClient.getBookingIds();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('bookingid');
    expect(typeof body[0].bookingid).toBe('number');
  });
});