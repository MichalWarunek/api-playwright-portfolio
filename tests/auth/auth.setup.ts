import { test as setup } from "../../fixtures";
import fs from 'fs';
import path from 'path';

const authFile = path.join(process.cwd(), '.auth/user.json');

setup('authentication', async ({ bookingClient }) => {
  const token = await bookingClient.getToken();
  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  fs.writeFileSync(authFile, JSON.stringify({ token: token }), 'utf-8');
});
