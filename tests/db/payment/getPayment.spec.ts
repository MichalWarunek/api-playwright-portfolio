import { test, expect, PaymentInterface, BookingInterface } from "../../../fixtures";
import paymentData from "../../../test-data/payment-data.json";
import bookingData from "../../../test-data/booking-data.json";

test.describe('Test Select Booking Record', () => {
 
 let paymentPayload: PaymentInterface;
 let bookingPayload: BookingInterface;
 let bookingCreatedId: number;
 let paymentCreatedId: number;
 
 
 test.beforeAll(async ({bookingDbClient, paymentDbClient}) => {
  paymentPayload = paymentData.paymentPayload;
  bookingPayload = bookingData.bookingPayload;
  bookingCreatedId = await bookingDbClient.insertBooking(bookingPayload);
  paymentCreatedId = await paymentDbClient.insertPayment(paymentPayload, bookingCreatedId);
  });


  test.afterAll(async ({paymentDbClient}) => {
    await paymentDbClient.deleteFromDb(paymentCreatedId); 
  });

  test('Should SELECT existing payment from local SQLite', async ({paymentDbClient}) => {
    const dbRow = await paymentDbClient.selectFromDb(paymentCreatedId);
    expect(dbRow).toBeDefined();
    expect(dbRow.id).toBe(paymentCreatedId);
    expect(dbRow.amount).toBe(paymentPayload.amount);
    expect(dbRow.paymentmethod).toBe(paymentPayload.paymentmethod);
    expect(dbRow.status).toBe(paymentPayload.status);
    expect(dbRow.createdat).toBe(paymentPayload.createdat);
  });
});