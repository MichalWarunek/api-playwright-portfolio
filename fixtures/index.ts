import { test as base } from "@playwright/test";
import fs from 'fs';
import path from 'path';
import { BookingClient } from "../api/BookingClient";
import { BookingDbClient, BookingInterface } from "../db/BookingDbClient";
import { PaymentDbClient, PaymentInterface } from "../db/PaymentDbClient";
import { db } from '../helpers/dbHelper';



type MyFixtures = {
    bookingClient: BookingClient;
    paymentDbClient: PaymentDbClient;
    apiToken: string;
};

type MyWorkerFixtures = {
    bookingDbClient: BookingDbClient;
}

export { BookingInterface, PaymentInterface };

export const test = base.extend<MyFixtures, MyWorkerFixtures>({
    apiToken: async ({}, use) => {
        const authFile = path.join(process.cwd(), '.auth/user.json');
        if (!fs.existsSync(authFile)) {
          throw new Error("File auth/user.json does not exists. Run 'setup' project first.");
        }
        const { token } = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
        await use(token);
      },
    bookingClient: async ({ request, apiToken }, use) => {
        await use(new BookingClient(request, apiToken));
      },
      bookingDbClient: [async ({}, use) => {
        await db.init();
        await use(new BookingDbClient());
        await db.close();
      }, {scope: 'worker'}],
    paymentDbClient: async ({}, use) => {
      await db.init();
        await use(new PaymentDbClient());
        await db.close();
    },
});

export { expect } from "@playwright/test";