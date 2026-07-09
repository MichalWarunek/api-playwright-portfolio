import { test as base } from "@playwright/test";
import fs from 'fs';
import path from 'path';
import { BookingClient } from "../api/BookingClient";


type MyFixtures = {
    bookingClient: BookingClient;
    apiToken: string;
};

export const test = base.extend<MyFixtures>({
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
});

export { expect } from "@playwright/test";