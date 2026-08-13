import { test, expect, PaymentInterface, BookingInterface } from "../../../fixtures";
import paymentData from "../../../test-data/payment-data.json";
import bookingData from "../../../test-data/booking-data.json";

test.describe('Test Select Booking Records with Payments @DB', () => {
 
 let paymentPayload: PaymentInterface;
 let bookingPayload: BookingInterface;
 const createdBookingIds: number[] = [];
 let paymentCreatedId: number;
 
 
 test.beforeAll(async ({bookingDbClient, paymentDbClient}) => {
    paymentPayload = paymentData.paymentPayload;
    bookingPayload = bookingData.bookingPayload;
    

    for (let i = 0; i < 5; i++) {
      const bookingId = await bookingDbClient.insertBooking(bookingPayload);
      createdBookingIds.push(bookingId);
    }
    paymentCreatedId = await paymentDbClient.insertPayment(paymentPayload, createdBookingIds[0]);
  });


  test.afterAll(async ({paymentDbClient, bookingDbClient}) => {
    await paymentDbClient.deleteFromDb(paymentCreatedId); 
    for (const bookingId of createdBookingIds) {
      await bookingDbClient.deleteFromDb(bookingId);
    }
  });


  test('Should SELECT existing booking with payments only from local SQLite', async ({bookingDbClient, allure}) => {
    await allure.story("Retrieve booking details with payments only successfully");
    const result = await bookingDbClient.selectBookingsWithPayment(createdBookingIds);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(createdBookingIds[0]);
  });


  test('Should SELECT existing bookings and payments from local SQLite', async ({bookingDbClient, allure}) => {
    await allure.story("Retrieve all booking details and payments successfully");
    const result = await bookingDbClient.selectAllBookingsAndPayments();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(createdBookingIds.length);
    const bookingWithPayment = result.find(row => row.id === createdBookingIds[0]);
    expect(bookingWithPayment.id).toBe(createdBookingIds[0]);
    const bookingWithoutPayment = result.find(row => row.id === createdBookingIds[1]);
    expect(bookingWithoutPayment).toBeDefined();
    expect(bookingWithoutPayment.paymentid).toBeNull();
  });

  test('Should SELECT existing payments and bookings from local SQLite', async ({bookingDbClient, allure}) => {
    await allure.story("Retrieve all payments and booking details successfully");
    const result = await bookingDbClient.selectAllPaymentsAndBookings();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(1);
    const bookingWithPayment = result.find(row => row.id === createdBookingIds[0]);
    expect(bookingWithPayment.id).toBe(createdBookingIds[0]);
    const bookingWithoutPayment = result.find(row => row.id === createdBookingIds[1]);
    expect(bookingWithoutPayment).toBeUndefined();
  });


});