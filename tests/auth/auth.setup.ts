import { test as setup, request as playwrightRequest } from "@playwright/test";
import { BookingClient } from "../../api/BookingClient";
import fs from 'fs';
import path from 'path';

const authFile = path.join(process.cwd(), '.auth/user.json');

setup('authentication', async () => {
  const context = await playwrightRequest.newContext();
  const bookingClient = new BookingClient(context, undefined as any);
  const token = await bookingClient.getToken();
  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  fs.writeFileSync(authFile, JSON.stringify({ token: token }), 'utf-8');
  await context.dispose();
});
