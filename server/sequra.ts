/**
 * Sequra Payment Integration
 * Handles payment processing via Sequra Order API with redirect flow
 * Docs: https://docs.sequra.com/docs/order-api-integration-steps
 */

import crypto from 'crypto';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SequraCartItem {
  reference: string;
  name: string;
  quantity: number;
  /** Unit price in cents (EUR) */
  price_with_tax: number;
  /** Total for this line in cents */
  total_with_tax: number;
  type: 'product' | 'handling' | 'discount' | 'invoice';
  /** false for physical products */
  downloadable: boolean;
}

export interface SequraCreateOrderParams {
  /** Your internal order reference */
  merchantRef: string;
  /** Total amount in EUR (e.g. 1490.00) */
  amountEur: number;
  customer: {
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    /** ISO date e.g. "1990-01-15" */
    dateOfBirth?: string;
    /** Spanish NIF/NIE */
    nin?: string;
    /** Client IP address */
    ipNumber?: string;
    /** Client User-Agent */
    userAgent?: string;
    /** Whether the customer is logged in */
    loggedIn?: boolean;
    /** Language code e.g. "es" */
    languageCode?: string;
  };
  items: SequraCartItem[];
  /** Frontend origin for return URLs, e.g. "https://elorasmart.online" */
  origin: string;
}

export interface SequraOrderResult {
  /** URL returned in Location header — store this to fetch the form */
  orderUrl: string;
  /** Sequra internal order ref */
  merchantRef: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export function getSequraConfig() {
  const merchantCode = process.env.SEQURA_MERCHANT_CODE;
  const apiKey = process.env.SEQURA_API_KEY;
  const secretKey = process.env.SEQURA_SECRET_KEY;
  const environment = process.env.SEQURA_ENVIRONMENT ?? 'production';

  if (!merchantCode || !apiKey) {
    throw new Error('Sequra credentials not configured (SEQURA_MERCHANT_CODE / SEQURA_API_KEY)');
  }

  const baseUrl = environment === 'sandbox'
    ? 'https://sandbox.sequrapi.com'
    : 'https://live.sequrapi.com';

  return { merchantCode, apiKey, secretKey: secretKey ?? '', baseUrl, environment };
}

function authHeader(): string {
  const { merchantCode, apiKey } = getSequraConfig();
  return `Basic ${Buffer.from(`${merchantCode}:${apiKey}`).toString('base64')}`;
}

// ─── Step 1: Start Solicitation ───────────────────────────────────────────────

/**
 * POST /orders — sends cart + shopper data to Sequra.
 * Returns the order URL from the Location header.
 */
export async function startSequraSolicitation(
  params: SequraCreateOrderParams
): Promise<SequraOrderResult> {
  const { merchantCode, baseUrl } = getSequraConfig();

  const amountCents = Math.round(params.amountEur * 100);

  const payload = {
    order: {
      state: 'confirmed',
      merchant: {
        id: merchantCode,
        notify_url: `${params.origin}/api/sequra/notification`,
        return_url: `${params.origin}/pago/ok?ref=${params.merchantRef}&method=sequra`,
        abort_url: `${params.origin}/pago/ko?ref=${params.merchantRef}&method=sequra`,
      },
      merchant_reference: {
        order_ref_1: params.merchantRef,
      },
      cart: {
        currency: 'EUR',
        gift: false,
        order_total_with_tax: amountCents,
        items: params.items,
      },
      delivery_method: {
        name: 'Envío estándar',
        provider: 'Elora Smart',
        speed: '5',
        tracking_number: '',
        tracking_url: '',
      },
      customer: {
        email: params.customer.email,
        mobile_phone: params.customer.phone ?? '',
        given_names: params.customer.firstName ?? '',
        surnames: params.customer.lastName ?? '',
        date_of_birth: params.customer.dateOfBirth ?? '',
        nin: params.customer.nin ?? '',
        nin_control: '',
        company: '',
        vat_number: '',
        logged_in: params.customer.loggedIn ?? false,
        language_code: params.customer.languageCode ?? 'es',
        ip_number: params.customer.ipNumber ?? '0.0.0.0',
        user_agent: params.customer.userAgent ?? 'Mozilla/5.0',
        title: '',
        ref: params.merchantRef,
        address: {
          company: '',
          address_line_1: '',
          address_line_2: '',
          postal_code: '',
          city: '',
          country_code: 'ES',
          given_names: params.customer.firstName ?? '',
          surnames: params.customer.lastName ?? '',
          phone: params.customer.phone ?? '',
          mobile_phone: params.customer.phone ?? '',
          state: '',
          extra: '',
        },
      },
      delivery_address: {
        company: '',
        address_line_1: '',
        address_line_2: '',
        postal_code: '',
        city: '',
        country_code: 'ES',
        given_names: params.customer.firstName ?? '',
        surnames: params.customer.lastName ?? '',
        phone: params.customer.phone ?? '',
        mobile_phone: params.customer.phone ?? '',
        state: '',
        extra: '',
      },
      invoice_address: {
        company: '',
        address_line_1: '',
        address_line_2: '',
        postal_code: '',
        city: '',
        country_code: 'ES',
        given_names: params.customer.firstName ?? '',
        surnames: params.customer.lastName ?? '',
        phone: params.customer.phone ?? '',
        mobile_phone: params.customer.phone ?? '',
        state: '',
        extra: '',
      },
      gui: {
        layout: 'desktop',
      },
      platform: {
        name: 'elora-smart-custom',
        version: '1.0.0',
        plugin_version: '1.0.0',
        uname: 'node',
        db_name: 'mysql',
        db_version: '8.0',
        php_version: 'node',
      },
    },
  };

  const response = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Sequra-Merchant-Id': merchantCode,
    },
    body: JSON.stringify(payload),
  });

  // Sequra returns 204 No Content with Location header on success
  if (response.status !== 201 && response.status !== 204 && !response.headers.get('location')) {
    const errorBody = await response.text();
    console.error('[Sequra] Start solicitation failed:', response.status, errorBody);
    throw new Error(`Sequra solicitation failed (${response.status}): ${errorBody}`);
  }

  const orderUrl = response.headers.get('location') ?? response.headers.get('Location') ?? '';
  if (!orderUrl) {
    throw new Error('Sequra did not return a Location header');
  }

  return {
    orderUrl,
    merchantRef: params.merchantRef,
  };
}

// ─── Step 2: Fetch identification form ───────────────────────────────────────

/**
 * GET {orderUrl}/form?product=<product>&ajax=1
 * Returns the HTML snippet to embed in checkout.
 */
export async function fetchSequraForm(
  orderUrl: string,
  product: string = 'i1'
): Promise<string> {
  const response = await fetch(`${orderUrl}/form_v2?product=${product}&ajax=1`, {
    headers: {
      Authorization: authHeader(),
      Accept: 'text/html',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch Sequra form_v2: ${response.status} ${body}`);
  }

  return response.text();
}

// ─── IPN Notification verification ───────────────────────────────────────────

/**
 * Verify the HMAC-SHA256 signature from Sequra IPN webhook.
 */
export function verifySequraSignature(body: string, signature: string): boolean {
  const { secretKey } = getSequraConfig();
  if (!secretKey) return true; // Skip if no secret configured
  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(body)
    .digest('base64');
  return hash === signature;
}

// ─── Step 3: Confirm order (called from IPN) ─────────────────────────────────

/**
 * PUT {orderUrl}/confirm — confirms the order after IPN approval.
 */
export async function confirmSequraOrder(orderUrl: string): Promise<boolean> {
  const response = await fetch(`${orderUrl}/confirm`, {
    method: 'PUT',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  return response.ok;
}
