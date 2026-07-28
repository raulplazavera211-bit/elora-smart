/**
 * ─── Redsys TPV Virtual Helper ───────────────────────────────────────────────
 *
 * Variables de entorno requeridas:
 *   REDSYS_SECRET_KEY    — Clave secreta del comercio
 *   REDSYS_MERCHANT_CODE — Código FUC del comercio (ej: 368959276)
 *   REDSYS_TERMINAL      — Terminal (1 = tarjeta, 3 = tarjeta+Bizum)
 *   REDSYS_SANDBOX       — "true" para pruebas, "false" para producción
 */

import {
  createRedsysAPI,
  SANDBOX_URLS,
  PRODUCTION_URLS,
  TRANSACTION_TYPES,
  CURRENCIES,
  isResponseCodeOk,
  randomTransactionId,
} from "redsys-easy";
import type { CurrencyNum, LanguageNum } from "redsys-easy";

// ─── Configuración ────────────────────────────────────────────────────────────

export function getRedsysConfig() {
  const secretKey = process.env.REDSYS_SECRET_KEY;
  const merchantCode = process.env.REDSYS_MERCHANT_CODE;
  const terminal = process.env.REDSYS_TERMINAL ?? "1";
  const isSandbox = process.env.REDSYS_SANDBOX !== "false"; // default sandbox

  if (!secretKey || !merchantCode) {
    throw new Error(
      "Redsys no configurado. Define REDSYS_SECRET_KEY y REDSYS_MERCHANT_CODE."
    );
  }

  return { secretKey, merchantCode, terminal, isSandbox };
}

// ─── Instancia de la API (singleton) ─────────────────────────────────────────

let _api: ReturnType<typeof createRedsysAPI> | null = null;

function getAPI() {
  // Recrear siempre para respetar el valor actual de REDSYS_SANDBOX
  const { secretKey, isSandbox } = getRedsysConfig();
  _api = createRedsysAPI({
    secretKey,
    urls: isSandbox ? SANDBOX_URLS : PRODUCTION_URLS,
  });
  return _api;
}

// ─── Tipos públicos ───────────────────────────────────────────────────────────

export interface RedsysFormData {
  url: string;
  body: {
    Ds_SignatureVersion: string;
    Ds_MerchantParameters: string;
    Ds_Signature: string;
  };
  redsysOrderId: string;
}

export interface RedsysNotificationResult {
  redsysOrderId: string;
  responseCode: string;
  success: boolean;
  amount: string;
  authCode?: string;
}

// ─── Crear formulario de redirección ─────────────────────────────────────────

export interface CreateRedsysFormParams {
  /**
   * Importe total en euros como string o número.
   * Puede ser "1490.00", "1490", 1490, 1490.5, etc.
   * Se convierte internamente a céntimos enteros.
   */
  amountEur: string | number;
  /** URL base del frontend (ej: "https://elora.manus.space") */
  frontendOrigin: string;
  merchantName?: string;
  productDescription?: string;
  /** Método de pago: "card", "bizum", "transfer", "cod", "paypal", "sequra". Por defecto ambos (tarjeta+Bizum). */
  payMethod?: "card" | "bizum" | "transfer" | "cod" | "paypal" | "sequra";
}

export function createRedsysForm(params: CreateRedsysFormParams): RedsysFormData {
  const { merchantCode, terminal } = getRedsysConfig();
  const { createRedirectForm } = getAPI();

  const redsysOrderId = randomTransactionId();

  // ── Importe: convertir euros → céntimos enteros como string ──────────────
  // Redsys espera el importe en la unidad mínima de la moneda (céntimos para EUR).
  // Multiplicamos por 100 y redondeamos para evitar errores de punto flotante.
  const amountFloat = typeof params.amountEur === "string"
    ? parseFloat(params.amountEur)
    : params.amountEur;

  if (!isFinite(amountFloat) || amountFloat <= 0) {
    throw new Error(`Importe inválido para Redsys: ${params.amountEur}`);
  }

  const amountCents = String(Math.round(amountFloat * 100));

  // ── URLs de retorno ───────────────────────────────────────────────────────
  const notificationUrl = `${params.frontendOrigin}/api/redsys/notification`;
  const urlOk = `${params.frontendOrigin}/pago/ok?order=${redsysOrderId}`;
  const urlKo = `${params.frontendOrigin}/pago/ko?order=${redsysOrderId}`;

  // ── Parámetros del formulario ─────────────────────────────────────────────
  const form = createRedirectForm({
    DS_MERCHANT_MERCHANTCODE: merchantCode,
    DS_MERCHANT_TERMINAL: terminal,
    DS_MERCHANT_TRANSACTIONTYPE: TRANSACTION_TYPES.AUTHORIZATION,
    DS_MERCHANT_ORDER: redsysOrderId,
    DS_MERCHANT_AMOUNT: amountCents,
    DS_MERCHANT_CURRENCY: CURRENCIES.EUR.num as CurrencyNum,
    DS_MERCHANT_MERCHANTNAME: params.merchantName ?? "ELORA SMART",
    DS_MERCHANT_PRODUCTDESCRIPTION: (params.productDescription ?? "Inodoro inteligente Elora Smart").slice(0, 125),
    DS_MERCHANT_MERCHANTURL: notificationUrl,
    DS_MERCHANT_URLOK: urlOk,
    DS_MERCHANT_URLKO: urlKo,
    DS_MERCHANT_CONSUMERLANGUAGE: "1" as LanguageNum,
    // Método de pago: "T" = tarjeta, "bizum" = Bizum, "T,bizum" = ambos
    DS_MERCHANT_PAYMETHODS: params.payMethod === "bizum" ? "bizum" : params.payMethod === "card" ? "T" : "T,bizum",
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
