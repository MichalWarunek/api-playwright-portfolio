import { APIRequestContext } from '@playwright/test';

export class BookingClient {
    private request: APIRequestContext;
    constructor(request: APIRequestContext) {
        this.request = request;
    }
    async getBookingIds() {
         return await this.request.get('/booking');
      }
    async getBooking(id: string) {
        return await this.request.get(`/booking/${id}`);
    }
    async postBooking(bookingData: object) {
          const response = await this.request.post('/booking', {
            data: bookingData
          });
          const body = await response.json();
          const generatedId = body.bookingid;
          return generatedId;
    }
    async deleteBooking(id: string) {
        return await this.request.delete(`/booking/${id}`);
    }
}