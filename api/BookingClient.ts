import { APIRequestContext } from '@playwright/test';

export class BookingClient {
    private request: APIRequestContext;
    constructor(request: APIRequestContext) {
        this.request = request;
    }
    async getBookingIds() {
         return await this.request.get('/booking');
      }

}