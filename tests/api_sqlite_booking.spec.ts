import { test, expect } from '@playwright/test';
import { db } from '../helpers/dbHelper';

test.describe('API + SQLite Tests', () => {
  const API_URL = 'https://restful-booker.herokuapp.com'; 

  
  test.beforeAll(async () => {
    await db.init();
  });


  test.afterAll(async () => {
    await db.close();
  });

  test('Should create a booking via API and store a copy in local SQLite', async ({ request }) => {
    const payload = {
      firstname: 'Maciej',
      lastname: 'Tester',
      totalprice: 150,
      depositpaid: true,
      bookingdates: { checkin: '2026-06-01', checkout: '2026-06-10' },
      additionalneeds: 'Breakfast'
    };


    const response = await request.post(`${API_URL}/booking`, {
      data: payload
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    const generatedId = body.bookingid;
    console.log(body);

   
    const database = await db.init();
    
 
    await database.run(
      'INSERT INTO bookings (id, firstname, lastname, totalprice, depositpaid) VALUES (?, ?, ?, ?, ?)',
      [generatedId, payload.firstname, payload.lastname, payload.totalprice, payload.depositpaid]
    );


    const dbRow = await database.get('SELECT * FROM bookings WHERE id = ?', [generatedId]);

    expect(dbRow).toBeDefined();
    expect(dbRow.firstname).toBe('Maciej');
    expect(dbRow.lastname).toBe('Tester');
    expect(dbRow.totalprice).toBe(150);
    expect(dbRow.depositpaid).toBe(1); 
  });
});