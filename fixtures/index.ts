import { test as base } from "@playwright/test";
import { BookingClient } from "../api/BookingClient";


type MyFixtures = {
    bookingClient: BookingClient;
};

export const test = base.extend<MyFixtures>({
    bookingClient: async ({ request }, use) => {
        await use(new BookingClient(request));
      },
});

export { expect } from "@playwright/test";