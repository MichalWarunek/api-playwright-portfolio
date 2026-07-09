import { APIRequestContext } from '@playwright/test';

interface BookingInterface {
  firstname: string,
  lastname: string,
  totalprice: number,
  depositpaid: boolean,
  bookingdates: { checkin: string, checkout: string },
  additionalneeds: string
}

export class BookingClient {
    private request: APIRequestContext;
    private token: string;
    constructor(request: APIRequestContext, token: string) {
        this.request = request;
        this.token = token;
    }
    async getBookingIds() {
         return await this.request.get('/booking');
      }

    async getBooking(id: string) {
        return await this.request.get(`/booking/${id}`);
    }

    async login({ 
      username = process.env.USER_NAME, 
      password = process.env.USER_PASSWORD, 
    } = {}) {
     return await this.request.post('/auth', {
        data: {
        "username": username,
        "password": password
        }
      });
    }
    
    async getToken({
      username = process.env.USER_NAME,
      password = process.env.USER_PASSWORD
    } = {}) {
      const response = await this.login({ username, password });
      const body = await response.json();
      return body.token;
    }

    async postBooking(bookingData: object) {
          const response = await this.request.post('/booking', {
            data: bookingData
          });
          const body = await response.json();
          const generatedId = body.bookingid;
          return generatedId;
    }
    async updateBooking(bookingId: string, bookingData: BookingInterface, token?:string) {
      return await this.request.put(`/booking/${bookingId}`, {
        data: bookingData,
        headers: {
          'Cookie': `token=${token ?? this.token}`
        }
      });
}
    async postBookingRaw(bookingData: object) {
        return await this.request.post('/booking', {
          data: bookingData
        });
  }
    async deleteBooking(id: string, token?: string) {
        return await this.request.delete(`/booking/${id}`, {
          headers: {
            'Cookie': `token=${token ?? this.token}`
          }
        });
    }
}