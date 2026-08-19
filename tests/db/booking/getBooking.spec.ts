import { test, expect, BookingInterface } from "../../../fixtures";
import bookingData from "../../../test-data/booking-data.json";

test.describe("Test Select Booking Record @DB", () => {
  let payload: BookingInterface;
  let createdId: number;

  test.beforeAll(async ({ bookingDbClient }) => {
    payload = bookingData.bookingPayload;
    createdId = await bookingDbClient.insertBooking(payload);
  });

  test.afterAll(async ({ bookingDbClient }) => {
    await bookingDbClient.deleteFromDb(createdId);
  });

  test("Should SELECT existing booking from local SQLite", async ({
    bookingDbClient,
    allure,
  }) => {
    await allure.story("Retrieve booking details successfully");
    const dbRow = await bookingDbClient.selectFromDb(createdId);
    expect(dbRow).toBeDefined();
    expect(dbRow.id).toBe(createdId);
    expect(dbRow.firstname).toBe(payload.firstname);
    expect(dbRow.lastname).toBe(payload.lastname);
    expect(dbRow.totalprice).toBe(payload.totalprice);
    expect(Boolean(dbRow.depositpaid)).toBe(payload.depositpaid);
    expect(dbRow.checkin).toBe(payload.bookingdates.checkin);
    expect(dbRow.checkout).toBe(payload.bookingdates.checkout);
    expect(dbRow.additionalneeds).toBe(payload.additionalneeds);
  });

  test("Should SELECT non-existing booking from local SQLite", async ({
    bookingDbClient,
    allure,
  }) => {
    await allure.story("Undefined error while retrieving booking details");
    const nonExistingId = 9999;
    const dbRow = await bookingDbClient.selectFromDb(nonExistingId);
    expect(dbRow).toBeUndefined();
  });
});
