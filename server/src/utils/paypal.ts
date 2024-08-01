import { env } from '@/config';

interface PayPalTokenResponse {
  access_token: string;
  // Add other properties from the response if needed
}

export const generatePayPalAccessToken = async (): Promise<string | undefined> => {
  try {
    const auth = Buffer.from(`${env.paypal.CLIENT_ID}:${env.paypal.CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${env.paypal.SANDBOX_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch access token');
    }

    const data = await response.json() as PayPalTokenResponse;
    return data.access_token;
  } catch (error) {
    console.error('Failed to generate Access Token: ', error);
  }
};
