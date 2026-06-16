/**
 * ─── Redsys TPV Virtual Helper ───────────────────────────────────────────────
 *
 * Encapsula la creación del formulario de redirección firmado y el procesado
 * de la notificación IPN (callback del servidor de Redsys).
 *
 * Variables de entorno requeridas:
 *   REDSYS_SECRET_KEY   — Clave secreta del comercio (Ej: sq7HjrUOBfKmC576ILgskD5srU870gJ7)
 *   REDSYS_MERCHANT_CODE — Código de comercio (Ej: 999008881)
 *   REDSYS_TERMINAL      — Terminal (Ej: 1)
 *   REDSYS_SANDBOX       — "true" para entorno de pruebas, "false" para producción
 */

import Decimal from "decimal.js";
import {
  createRedsysAPI,
  SANDBOX_URLS,
  PRODUCTION_URLS,
  TRANSACTION_TYPES,
  CURRENCIES,
  isResponseCodeOk,
  randomTransactionId,
} from "redsys-easy";

// ─── Configuración ────────────────────────────────────────────────────────────

export function getRedsysConfig() {
  const secretKey = process.env.REDSYS_SECRET_KEY;
  const merchantCode = process.env.REDSYS_MERCHANT_CODE;
  const terminal = process.env.REDSYS_TERMINAL ?? "1";
  const isSandbox = process.env.REDSYS_SANDBOX !== "false"; // default sandbox

  if (!secretKey || !merchantCode) {
    throw new Error(
      "Redsys no configurado. Define REDSYS_SECRET_KEY y REDSYS_MERCHANT_CODE en las variables de entorno."
    );
  }

  return { secretKey, merchantCode, terminal, isSandbox };
}

// ─── Instancia de la API ──────────────────────────────────────────────────────

let _api: ReturnType<typeof createRedsysAPI> | null = null;

function getAPI() {
  if (_api) return _api;
  const { secretKey, isSandbox } = getRedsysConfig();
  _api = createRedsysAPI({
    secretKey,
    urls: isSandbox ? SANDBOX_URLS : PRODUCTION_URLS,
  });
  return _api;
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface RedsysFormData {
  /** URL de acción del formulario POST */
  url: string;
  /** Campos ocultos del formulario */
  body: {
    Ds_SignatureVersion: string;
    Ds_MerchantParameters: string;
    Ds_Signature: string;
  };
  /** ID de orden generado para Redsys (12 chars alfanumérico) */
  redsysOrderId: string;
}

export interface RedsysNotificationResult {
  /** ID de orden Redsys (12 chars) */
  redsysOrderId: string;
  /** Código de respuesta (0000 = OK) */
  responseCode: string;
  /** true si el pago fue aprobado */
  success: boolean;
  /** Importe autorizado en céntimos */
  amount: string;
  /** Número de autorización del banco */
  authCode?: string;
}

// ─── Crear formulario de redirección ─────────────────────────────────────────

export interface CreateRedsysFormParams {
  /** Importe total en euros (ej: "149.00") */
  amountEur: string;
  /** URL base del frontend (ej: "https://elora.manus.space") */
  frontendOrigin: string;
  /** Nombre del comercio que aparece en el TPV */
  merchantName?: string;
  /** Descripción del pedido (aparece en el TPV) */
  productDescription?: string;
}

export function createRedsysForm(params: CreateRedsysFormParams): RedsysFormData {
  const { secretKey: _sk, merchantCode, terminal } = getRedsysConfig();
  const { createRedirectForm } = getAPI();

  const redsysOrderId = randomTransactionId();
  const currencyInfo = CURRENCIES["EUR"];

  // Convertir euros a céntimos (sin floats)
  const redsysAmount = new Decimal(params.amountEur)
    .mul(Math.pow(10, currencyInfo.decimals))
    .round()
    .toFixed(0);

  const redsysCurrency = currencyInfo.num; // 978

  const notificationUrl = `${params.frontendOrigin}/api/redsys/notification`;
  const urlOk = `${params.frontendOrigin}/pago/ok?order=${redsysOrderId}`;
  const urlKo = `${params.frontendOrigin}/pago/ko?order=${redsysOrderId}`;

  const form = createRedirectForm({
    DS_MERCHANT_MERCHANTCODE: merchantCode,
    DS_MERCHANT_TERMINAL: terminal,
    DS_MERCHANT_TRANSACTIONTYPE: TRANSACTION_TYPES.AUTHORIZATION, // "0"
    DS_MERCHANT_ORDER: redsysOrderId,
    DS_MERCHANT_AMOUNT: redsysAmount,
    DS_MERCHANT_CURRENCY: redsysCurrency,
    DS_MERCHANT_MERCHANTNAME: params.merchantName ?? "ELORA SMART",
    DS_MERCHANT_PRODUCTDESCRIPTION: params.productDescription ?? "Inodoro inteligente Elora Smart",
    DS_MERCHANT_MERCHANTURL: notificationUrl,
    DS_MERCHANT_URLOK: urlOk,
    DS_MERCHANT_URLKO: urlKo,
    DS_MERCHANT_CONSUMERLANGUAGE: "1" as "1", // español
  });

  return {
    url: form.url,
    body: form.body,
    redsysOrderId,
  };
}

// ─── Procesar notificación IPN ────────────────────────────────────────────────

export interface RedsysNotificationInput {
  Ds_SignatureVersion: string;
  Ds_MerchantParameters: string;
  Ds_Signature: string;
}

export function processRedsysNotification(
  input: RedsysNotificationInput
): RedsysNotificationResult {
  const { processRestNotification } = getAPI();

  const params = processRestNotification(input);

  return {
    redsysOrderId: params.Ds_Order ?? "",
    responseCode: params.Ds_Response ?? "",
    success: isResponseCodeOk(params.Ds_Response ?? "9999"),
    amount: params.Ds_Amount ?? "0",
    authCode: params.Ds_AuthorisationCode,
  };
}
