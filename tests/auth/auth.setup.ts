import { test as setup } from "../../fixtures";


setup('authentication', async ({ bookingClient }) => {
  const token = await bookingClient.getToken();
  process.env.API_TOKEN = token;
});
