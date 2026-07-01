import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

// ─── Dataset de códigos postales de España ────────────────────────────────────
type CpEntry = { cp: string; municipio: string; provincia: string };
let _cpData: CpEntry[] | null = null;
function getCpData(): CpEntry[] {
  if (!_cpData) {
    try {
      const __dirname = fileURLToPath(new URL(".", import.meta.url));
      const raw = readFileSync(join(__dirname, "cp_data.json"), "utf-8");
      _cpData = JSON.parse(raw) as CpEntry[];
    } catch {
      _cpData = [];
    }
  }
  return _cpData;
}
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import bcrypt from "bcryptjs";
import {
  insertContactSubmission,
  insertClubEloraSignup,
  getContactSubmissions,
  getClubEloraSignups,
  getAllProducts,
  getProductBySlug,
  getProductById,
  insertProduct,
  updateProduct,
  countProducts,
  createOrder,
  getAllOrdersWithItems,
  getOrderWithItems,
  updateOrderStatus,
  countOrders,
  getTotalRevenue,
  getAllUsers,
  countUsers,
  linkRedsysOrder,
  updatePaymentStatus,
  getOrderByRedsysId,
  getAllPaymentMethods,
  getEnabledPaymentMethods,
  upsertPaymentMethod,
  togglePaymentMethod,
  updatePaymentMethodConfig,
  seedDefaultPaymentMethods,
  getAdminCredentialByEmail,
  upsertAdminCredential,
  countAdminCredentials,
  getAllCoupons,
  getCouponByCode,
  insertCoupon,
  updateCoupon,
  deleteCoupon,
  incrementCouponUsage,
} from "./db";
import { createRedsysForm, processRedsysNotification, getRedsysConfig } from "./redsys";
import { sendOrderConfirmationEmail } from "./email";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      // Also clear admin session cookie
      ctx.res.clearCookie("elora_admin_session", { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    // ─── ADMIN CUSTOM LOGIN ────────────────────────────────────────────────
    adminLogin: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(1),
        rememberMe: z.boolean().optional().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        const cred = await getAdminCredentialByEmail(input.email);
        if (!cred) throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciales incorrectas" });
        const valid = await bcrypt.compare(input.password, cred.passwordHash);
        if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciales incorrectas" });
        // Sign a JWT session for the admin
        const { SignJWT } = await import("jose");
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "elora-admin-secret");
        // rememberMe: 30 days; otherwise: 8 hours (session)
        const expiresIn = input.rememberMe ? "30d" : "8h";
        const maxAgeMs = input.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
        const token = await new SignJWT({ role: "admin", email: cred.email })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime(expiresIn)
          .sign(secret);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie("elora_admin_session", token, {
          ...cookieOptions,
          maxAge: maxAgeMs,
          httpOnly: true,
        });
        return { success: true };
      }),

    // Verify admin session (used by frontend to check if logged in)
    adminMe: publicProcedure.query(async ({ ctx }) => {
      try {
        const { parse: parseCookies } = await import("cookie");
        const cookies = parseCookies(ctx.req.headers.cookie || "");
        const token = cookies["elora_admin_session"];
        if (!token) return null;
        const { jwtVerify } = await import("jose");
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "elora-admin-secret");
        const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
        if (payload.role !== "admin") return null;
        return { email: payload.email as string, role: "admin" as const };
      } catch {
        return null;
      }
    }),

    // Setup: create admin credentials (only works if no admin exists yet, or from existing admin)
    adminSetup: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
        setupKey: z.string(), // one-time setup key from env
      }))
      .mutation(async ({ input }) => {
        const expectedKey = process.env.ADMIN_SETUP_KEY || "elora-setup-2024";
        if (input.setupKey !== expectedKey) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Clave de configuración incorrecta" });
        }
        const hash = await bcrypt.hash(input.password, 12);
        await upsertAdminCredential(input.email, hash);
        return { success: true };
      }),
  }),

  // ─── CONTACT FORM ────────────────────────────────────────────────────────
  contact: router({
    submit: publicProcedure
      .input(z.object({
        nombre: z.string().min(1).max(255),
        telefono: z.string().max(64).optional(),
        email: z.string().email().max(320),
        mensaje: z.string().max(5000).optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await insertContactSubmission({
          nombre: input.nombre,
          telefono: input.telefono ?? null,
          email: input.email,
          mensaje: input.mensaje ?? null,
        });
        notifyOwner({
          title: `📬 Nuevo contacto: ${input.nombre}`,
          content: [`Nombre: ${input.nombre}`, `Email: ${input.email}`, input.telefono ? `Teléfono: ${input.telefono}` : null, input.mensaje ? `Mensaje:\n${input.mensaje}` : null].filter(Boolean).join("\n"),
        }).catch(() => {});
        return { success: true, id };
      }),
  }),

  // ─── CLUB ELORA ──────────────────────────────────────────────────────────
  clubElora: router({
    signup: publicProcedure
      .input(z.object({
        nombre: z.string().max(255).optional(),
        email: z.string().email().max(320),
      }))
      .mutation(async ({ input }) => {
        const { id, alreadyExists } = await insertClubEloraSignup({
          nombre: input.nombre ?? null,
          email: input.email,
        });
        if (!alreadyExists) {
          notifyOwner({
            title: `⭐ Nuevo miembro del Club Elora`,
            content: [`Email: ${input.email}`, input.nombre ? `Nombre: ${input.nombre}` : null].filter(Boolean).join("\n"),
          }).catch(() => {});
        }
        return { success: true, alreadyExists };
      }),
  }),

  // ─── PRODUCTS (public) ───────────────────────────────────────────────────
  products: router({
    getAll: publicProcedure.query(async () => {
      return getAllProducts(false);
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const product = await getProductBySlug(input.slug);
        if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Producto no encontrado" });
        return product;
      }),
  }),

  // ─── ORDERS (public checkout) ─────────────────────────────────────────────
  orders: router({
    create: publicProcedure
      .input(z.object({
        customerName: z.string().min(1).max(255),
        customerEmail: z.string().email().max(320),
        customerPhone: z.string().max(64).optional(),
        address: z.string().max(1000).optional(),
        shippingAddress: z.string().max(500).optional(),
        shippingCity: z.string().max(255).optional(),
        shippingProvince: z.string().max(128).optional(),
        shippingPostalCode: z.string().max(10).optional(),
        paymentMethod: z.string().max(32).optional(),
        notes: z.string().max(2000).optional(),
        items: z.array(z.object({
          productId: z.number().optional(),
          productName: z.string().min(1).max(255),
          productSlug: z.string().max(128).optional(),
          productImg: z.string().max(1000).optional(),
          unitPrice: z.number().positive(),
          quantity: z.number().int().positive().default(1),
        })).min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const total = input.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        const orderId = await createOrder(
          {
            userId: ctx.user?.id ?? null,
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone ?? null,
            address: input.address ?? null,
            shippingAddress: input.shippingAddress ?? null,
            shippingCity: input.shippingCity ?? null,
            shippingProvince: input.shippingProvince ?? null,
            shippingPostalCode: input.shippingPostalCode ?? null,
            paymentMethod: input.paymentMethod ?? null,
            notes: input.notes ?? null,
            status: "pending",
            total: total.toFixed(2) as unknown as string,
          },
          input.items.map(item => ({
            orderId: 0, // placeholder — overwritten by createOrder helper
            productId: item.productId ?? null,
            productName: item.productName,
            productSlug: item.productSlug ?? null,
            productImg: item.productImg ?? null,
            unitPrice: item.unitPrice.toFixed(2) as unknown as string,
            quantity: item.quantity,
          }))
        );
        if (!orderId) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No se pudo crear el pedido" });

        // Notify owner
        const itemsList = input.items.map(i => `• ${i.productName} x${i.quantity} — ${(i.unitPrice * i.quantity).toLocaleString('es-ES')}€`).join("\n");
        notifyOwner({
          title: `🛒 Nuevo pedido #${orderId} — ${total.toLocaleString('es-ES')}€`,
          content: `Cliente: ${input.customerName}\nEmail: ${input.customerEmail}\n${input.customerPhone ? `Teléfono: ${input.customerPhone}\n` : ''}Total: ${total.toLocaleString('es-ES')}€\n\nProductos:\n${itemsList}`,
        }).catch(() => {});

        // Enviar email de confirmación para métodos de pago manuales
        // (tarjeta/Bizum van por Redsys y reciben el email desde el webhook IPN)
        const manualMethods = ["transfer", "cod", "paypal"];
        if (input.paymentMethod && manualMethods.includes(input.paymentMethod)) {
          sendOrderConfirmationEmail({
            to: input.customerEmail,
            customerName: input.customerName,
            orderNumber: String(orderId),
            items: input.items.map(i => ({
              name: i.productName,
              quantity: i.quantity,
              price: i.unitPrice,
            })),
            total,
            shippingAddress: {
              street: input.shippingAddress ?? input.address ?? "",
              city: input.shippingCity ?? "",
              province: input.shippingProvince ?? "",
              postalCode: input.shippingPostalCode ?? "",
            },
            paymentMethod: input.paymentMethod,
          }).catch(() => {});
        }

        return { success: true, orderId };
      }),

    /**
     * Inicia el pago Redsys para un pedido ya creado.
     * Devuelve la URL del TPV y los campos del formulario firmado.
     */
    initPayment: publicProcedure
      .input(z.object({
        orderId: z.number(),
        /** Origen del frontend para construir las URLs de retorno */
        origin: z.string().url(),
        /** Método de pago elegido por el cliente */
        payMethod: z.enum(["card", "bizum", "transfer", "cod", "paypal"]).default("card"),
      }))
      .mutation(async ({ input }) => {
        // Verificar que Redsys está configurado
        try {
          getRedsysConfig();
        } catch {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "La pasarela de pago Redsys no está configurada. Contacta con el administrador.",
          });
        }

        // Obtener el pedido
        const order = await getOrderWithItems(input.orderId);
        if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Pedido no encontrado" });

        const productDesc = order.items.map(i => `${i.productName} x${i.quantity}`).join(", ");

        // Generar formulario Redsys firmado
        const form = createRedsysForm({
          amountEur: order.total,
          frontendOrigin: input.origin,
          merchantName: "ELORA SMART",
          productDescription: productDesc.slice(0, 125), // máx 125 chars
          payMethod: input.payMethod,
        });

        // Vincular el redsysOrderId al pedido en la DB
        await linkRedsysOrder(input.orderId, form.redsysOrderId);

        return {
          url: form.url,
          body: form.body,
          redsysOrderId: form.redsysOrderId,
        };
      }),
  }),

  // ─── PAYMENTS (public) ─────────────────────────────────────────────────
  payments: router({
    getActive: publicProcedure.query(async () => {
      await seedDefaultPaymentMethods();
      return getEnabledPaymentMethods();
    }),
  }),

  // ─── ADMIN ───────────────────────────────────────────────────────────────
  admin: router({
    // Dashboard stats
    getDashboardStats: adminProcedure.query(async () => {
      const [totalOrders, totalRevenue, totalProducts, totalUsers, totalContacts, totalClubMembers] = await Promise.all([
        countOrders(),
        getTotalRevenue(),
        countProducts(),
        countUsers(),
        getContactSubmissions().then(r => r.length),
        getClubEloraSignups().then(r => r.length),
      ]);
      return { totalOrders, totalRevenue, totalProducts, totalUsers, totalContacts, totalClubMembers };
    }),

    // Contacts
    getContacts: adminProcedure.query(async () => getContactSubmissions()),

    // Club Elora signups
    getClubSignups: adminProcedure.query(async () => getClubEloraSignups()),

    // Users / Customers
    getUsers: adminProcedure.query(async () => getAllUsers()),

    // Products management
    getProducts: adminProcedure.query(async () => getAllProducts(true)),

    updateProduct: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        tagline: z.string().max(512).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        /** Set to null to remove the original price (discount) */
        originalPrice: z.number().positive().nullable().optional(),
        stock: z.number().int().min(0).optional(),
        active: z.boolean().optional(),
        sortOrder: z.number().int().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, price, originalPrice, ...rest } = input;
        const updateData: Record<string, unknown> = { ...rest };
        if (price !== undefined) updateData.price = price.toFixed(2);
        if (originalPrice !== undefined) updateData.originalPrice = originalPrice !== null ? originalPrice.toFixed(2) : null;
        await updateProduct(id, updateData as Parameters<typeof updateProduct>[1]);
        return { success: true };
      }),

    // ─── COUPONS ────────────────────────────────────────────────────────────
    getCoupons: adminProcedure.query(async () => {
      return getAllCoupons();
    }),

    createCoupon: adminProcedure
      .input(z.object({
        code: z.string().min(2).max(64),
        description: z.string().max(255).optional(),
        type: z.enum(["percentage", "fixed"]),
        value: z.number().positive(),
        minOrderAmount: z.number().positive().optional(),
        maxUses: z.number().int().positive().optional(),
        expiresAt: z.date().optional(),
        active: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        const { value, minOrderAmount, ...rest } = input;
        const id = await insertCoupon({
          ...rest,
          value: value.toFixed(2),
          minOrderAmount: minOrderAmount !== undefined ? minOrderAmount.toFixed(2) : null,
          expiresAt: input.expiresAt ?? null,
        } as Parameters<typeof insertCoupon>[0]);
        return { success: true, id };
      }),

    updateCoupon: adminProcedure
      .input(z.object({
        id: z.number(),
        code: z.string().min(2).max(64).optional(),
        description: z.string().max(255).optional(),
        type: z.enum(["percentage", "fixed"]).optional(),
        value: z.number().positive().optional(),
        minOrderAmount: z.number().positive().nullable().optional(),
        maxUses: z.number().int().positive().nullable().optional(),
        expiresAt: z.date().nullable().optional(),
        active: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, value, minOrderAmount, ...rest } = input;
        const updateData: Record<string, unknown> = { ...rest };
        if (value !== undefined) updateData.value = value.toFixed(2);
        if (minOrderAmount !== undefined) updateData.minOrderAmount = minOrderAmount !== null ? minOrderAmount.toFixed(2) : null;
        await updateCoupon(id, updateData as Parameters<typeof updateCoupon>[1]);
        return { success: true };
      }),

    deleteCoupon: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteCoupon(input.id);
        return { success: true };
      }),

    // ─── VALIDATE COUPON (public) ────────────────────────────────────────────
    validateCoupon: publicProcedure
      .input(z.object({
        code: z.string(),
        orderAmount: z.number().positive(),
      }))
      .mutation(async ({ input }) => {
        const coupon = await getCouponByCode(input.code);
        if (!coupon) throw new TRPCError({ code: 'NOT_FOUND', message: 'Cupón no encontrado' });
        if (!coupon.active) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Este cupón no está activo' });
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Este cupón ha caducado' });
        if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Este cupón ha alcanzado el límite de usos' });
        const minAmount = coupon.minOrderAmount ? parseFloat(String(coupon.minOrderAmount)) : 0;
        if (input.orderAmount < minAmount) throw new TRPCError({ code: 'BAD_REQUEST', message: `El pedido mínimo para este cupón es ${minAmount.toFixed(2)} €` });
        const value = parseFloat(String(coupon.value));
        const discount = coupon.type === 'percentage' ? (input.orderAmount * value) / 100 : Math.min(value, input.orderAmount);
        return {
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          value,
          discount: parseFloat(discount.toFixed(2)),
          description: coupon.description,
        };
      }),

    seedProducts: adminProcedure.mutation(async () => {
      // Seed the 6 Elora Smart products into the database
      const existing = await getAllProducts(true);
      if (existing.length > 0) return { success: true, message: "Los productos ya están en la base de datos", count: existing.length };

      const PRODUCTS_DATA = [
        {
          slug: "esenza",
          name: "Inodoro inteligente ESENZA",
          tagline: "El inodoro inteligente japonés a suelo de ELORA SMART.",
          description: "Ideal para reformas de baño y para sustituir un inodoro tradicional sin cambiar la instalación.",
          longDescription: "ESENZA a suelo es el inodoro inteligente japonés de ELORA SMART, ideal para reformas de baño y para sustituir un inodoro tradicional sin cambiar la instalación. Mantiene todas las funciones esenciales de la gama ESENZA con instalación sencilla, máxima estabilidad y un diseño de líneas limpias para baños modernos. Incluye 10 años de garantía en la cerámica y 3 años en la tecnología, ampliables a 5 años con ELORA Premium Care.",
          price: "1490.00",
          img: "https://elorasmart.com/wp-content/uploads/2025/12/esenza2-800x800.jpg",
          gallery: JSON.stringify(["https://elorasmart.com/wp-content/uploads/2025/12/esenza2-800x800.jpg","https://elorasmart.com/wp-content/uploads/2025/12/ESENZa-12.webp","https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-9.webp","https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-10.webp","https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-7.webp","https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-8.webp"]),
          badges: JSON.stringify(["Best seller","Sin obra"]),
          features: JSON.stringify(["Apertura, cierre y descarga automáticos","Sensor de pie integrado","Detección de postura (pie/sentado)","Lavado posterior, femenino y móvil","Agua caliente instantánea (4 temperaturas)","Boquilla autolimpiable en acero inoxidable","Asiento antibacteriano CLIMADAPT","Secado Súper-Tifón en menos de 30 segundos (5 velocidades)","Panel digital en cristal templado","Mando a distancia en español (2 usuarios)","Luz ambiente LED y luz nocturna","Diseño rimless (sin reborde interior)","Tapa de caída amortiguada","Tanque integrado de 5 litros","Bomba doble de alta potencia","Funcionamiento silencioso ≤59 dB"]),
          highlights: JSON.stringify([{"label":"Asiento","value":"CLIMADAPT"},{"label":"Secado","value":"< 30 segundos"},{"label":"Garantía","value":"10 años cerámica"}]),
          faqs: JSON.stringify([{"q":"¿Necesito obra para instalar el ESENZA?","a":"No. Sustituye a tu inodoro actual con las mismas conexiones. Solo necesitas un enchufe cerca."},{"q":"¿Funciona con baja presión de agua?","a":"Sí. El tanque integrado de 5 litros garantiza un funcionamiento fiable incluso en edificios antiguos o con baja presión."}]),
          warranty: JSON.stringify({"years":3,"details":"10 años de garantía en la cerámica · 3 años en la tecnología (ampliable a 5 años con ELORA Premium Care por 249€). Servicio técnico en español."}),
          stock: 999,
          active: true,
          sortOrder: 1,
        },
        {
          slug: "esenza-compact",
          name: "Inodoro inteligente ESENZA compact",
          tagline: "Todas las funciones en fondo reducido.",
          description: "El inodoro inteligente japonés de fondo reducido. Optimiza cada centímetro sin renunciar a ninguna función.",
          longDescription: "ESENZA COMPACT es el inodoro inteligente compacto de ELORA SMART, pensado para ganar espacio en baños pequeños, reformas y obra nueva. Su diseño más corto y totalmente pegado a la pared optimiza cada centímetro, manteniendo las funciones esenciales de ESENZA.",
          price: "1590.00",
          img: "https://elorasmart.com/wp-content/uploads/2025/12/batch_5.webp",
          gallery: JSON.stringify(["https://elorasmart.com/wp-content/uploads/2025/12/batch_5.webp","https://elorasmart.com/wp-content/uploads/2025/12/batch_1.webp","https://elorasmart.com/wp-content/uploads/2025/12/batch_2.webp","https://elorasmart.com/wp-content/uploads/2025/12/batch_10.webp"]),
          badges: JSON.stringify(["Compact","Back-to-wall"]),
          features: JSON.stringify(["Apertura, cierre y descarga automáticos","Sensor de pie integrado","Lavado posterior, femenino y móvil","Agua caliente instantánea","Asiento calefactado CLIMADAPT","Secado en menos de 30 segundos (5 velocidades)","Mando a distancia en español (2 usuarios)","Cerámica rimless","Tanque integrado de 5 litros","Funcionamiento silencioso ≤59 dB"]),
          highlights: JSON.stringify([{"label":"Formato","value":"Fondo reducido"},{"label":"Instalación","value":"Back-to-wall"},{"label":"Garantía","value":"10 años"}]),
          faqs: JSON.stringify([{"q":"¿En qué se diferencia del ESENZA estándar?","a":"Tiene fondo reducido y diseño back-to-wall (pegado a pared), ideal para baños pequeños. Las funciones son idénticas."}]),
          warranty: JSON.stringify({"years":3,"details":"10 años cerámica · 3 años tecnología (ampliable a 5 con Premium Care +249€)"}),
          stock: 999,
          active: true,
          sortOrder: 2,
        },
        {
          slug: "esenza-suspendido",
          name: "Inodoro inteligente ESENZA suspendido",
          tagline: "Diseño flotante con funciones esenciales.",
          description: "El inodoro inteligente japonés flotante de ELORA SMART. Libera el suelo y aporta una estética minimalista y contemporánea.",
          longDescription: "ESENZA Suspendido es el inodoro inteligente japonés flotante de ELORA SMART, diseñado para baños modernos que buscan un acabado más limpio, minimalista y elevado del suelo.",
          price: "1690.00",
          img: "https://elorasmart.com/wp-content/uploads/2025/12/batch_4-1.webp",
          gallery: JSON.stringify(["https://elorasmart.com/wp-content/uploads/2025/12/batch_4-1.webp","https://elorasmart.com/wp-content/uploads/2025/12/batch_2-1.webp","https://elorasmart.com/wp-content/uploads/2025/12/batch_6-1.webp"]),
          badges: JSON.stringify(["Suspendido","Rimless"]),
          features: JSON.stringify(["Apertura, cierre y descarga automáticos","Sensor de pie integrado","Lavado posterior, femenino y móvil","Agua caliente instantánea","Asiento calefactado CLIMADAPT","Secado en menos de 30 segundos (5 velocidades)","Diseño flotante — suelo completamente libre","Funcionamiento silencioso ≤59 dB"]),
          highlights: JSON.stringify([{"label":"Instalación","value":"Suspendida"},{"label":"Suelo","value":"Completamente libre"},{"label":"Garantía","value":"10 años"}]),
          faqs: JSON.stringify([{"q":"¿Necesita obra?","a":"Sí, requiere instalación suspendida en pared. Es habitual en reformas de baño modernas."}]),
          warranty: JSON.stringify({"years":3,"details":"10 años cerámica · 3 años tecnología (ampliable a 5 con Premium Care +249€)"}),
          stock: 999,
          active: true,
          sortOrder: 3,
        },
        {
          slug: "aura-compact",
          name: "Inodoro inteligente AURA compact",
          tagline: "Tecnología AURA completa en formato compacto.",
          description: "Combina tecnología y diseño compacto: apertura automática, lavado personalizable, secado rápido, asiento climatizado, esterilización UV, desodorización y control por voz.",
          longDescription: "El inodoro inteligente AURA COMPACT combina tecnología y un diseño compacto, ofreciendo todas las ventajas como: apertura automática, lavado personalizable, secado rápido, asiento climatizado, esterilización UV, desodorización, control por voz y mando.",
          price: "2500.00",
          img: "https://elorasmart.com/wp-content/uploads/2025/05/AURA-compact-p-800x800.jpg",
          gallery: JSON.stringify(["https://elorasmart.com/wp-content/uploads/2025/05/AURA-compact-p-800x800.jpg","https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-1.jpg","https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-11.jpg","https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-6.jpg"]),
          badges: JSON.stringify(["ClimAdapt","UV · Voz"]),
          features: JSON.stringify(["Sensor inteligente ClimAdapt","Apertura automática de tapa","Lavado personal con agua tibia","Secado con aire caliente","Desodorización automática","Asiento calefactable","Escudo de espuma anti-salpicaduras","Esterilización UV","Control remoto en español","Control por voz (inglés)"]),
          highlights: JSON.stringify([{"label":"ClimAdapt","value":"Sensor inteligente"},{"label":"UV","value":"Esterilización"},{"label":"Control","value":"Por voz"}]),
          faqs: JSON.stringify([{"q":"¿Funciona el control por voz en español?","a":"Actualmente el control por voz está disponible solo en inglés. El mando a distancia físico está completamente en español."}]),
          warranty: JSON.stringify({"years":5,"details":"5 años de garantía en tecnología incluidos. 10 años en cerámica. Servicio técnico en español."}),
          stock: 999,
          active: true,
          sortOrder: 4,
        },
        {
          slug: "aura-suspendido",
          name: "Váter japonés AURA suspendido",
          tagline: "Todo el confort AURA en diseño flotante.",
          description: "Todo el confort del Water japonés AURA en un diseño flotante. Estética moderna y minimalista, suelo totalmente libre, altura ajustable en la instalación.",
          longDescription: "El váter japonés AURA suspendido ofrece todo el confort del Water japonés AURA en un diseño flotante, con una estética moderna y minimalista que deja el suelo totalmente libre.",
          price: "2600.00",
          img: "https://elorasmart.com/wp-content/uploads/2025/05/AURA-suspendido-p-800x800.jpg",
          gallery: JSON.stringify(["https://elorasmart.com/wp-content/uploads/2025/05/AURA-suspendido-p-800x800.jpg","https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido1.jpg","https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido-2.jpg","https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido-3.jpg"]),
          badges: JSON.stringify(["Suspendido","Altura ajustable"]),
          features: JSON.stringify(["Sensor inteligente ClimAdapt","Lavado personal con agua tibia","Secado con aire caliente","Desodorización automática","Asiento calefactable","Escudo de espuma anti-salpicaduras","Diseño suspendido — suelo totalmente libre","Altura ajustable en instalación","Control remoto en español","Control por voz (inglés)"]),
          highlights: JSON.stringify([{"label":"Instalación","value":"Suspendida"},{"label":"Suelo","value":"Totalmente libre"},{"label":"Altura","value":"Ajustable"}]),
          faqs: JSON.stringify([{"q":"¿Puedo ajustar la altura?","a":"Sí. Puedes ajustar la altura del váter a tu gusto en el momento de la instalación."}]),
          warranty: JSON.stringify({"years":5,"details":"5 años de garantía en tecnología. 10 años en cerámica. Servicio técnico en español."}),
          stock: 999,
          active: true,
          sortOrder: 5,
        },
        {
          slug: "aura",
          name: "Water japonés AURA",
          tagline: "La experiencia AURA completa.",
          description: "El inodoro inteligente más completo de ELORA SMART. Disponible en 3 colores de display: Gris y Negro, Blanco y Gris.",
          longDescription: "El water japonés AURA ofrece higiene y confort con funciones como apertura automática, asiento climatizado, lavado ajustable, secado, esterilización con rayos UV y aromaterapia. Con control remoto en español, memoria de usuarios y un diseño moderno.",
          price: "2500.00",
          img: "https://elorasmart.com/wp-content/uploads/2025/05/inodoro-aura.jpg",
          gallery: JSON.stringify(["https://elorasmart.com/wp-content/uploads/2025/05/inodoro-aura.jpg","https://elorasmart.com/wp-content/uploads/2025/05/aura-elorasmart7-scaled.jpg","https://elorasmart.com/wp-content/uploads/2025/05/aura-elorasmart6.jpg","https://elorasmart.com/wp-content/uploads/2025/05/aura-elorasmart5.jpg"]),
          badges: JSON.stringify(["3 colores","UV + Aromaterapia"]),
          features: JSON.stringify(["Sensor inteligente ClimAdapt","Apertura automática de tapa","Lavado personal con agua tibia","Secado con aire caliente","Desodorización automática","Asiento calefactable","Aromaterapia integrada","Escudo de espuma anti-salpicaduras","Esterilización UV ultravioleta","Terapia de calor por infrarrojos","Control remoto en español","Control por voz (inglés)","Disponible en 3 colores de display"]),
          highlights: JSON.stringify([{"label":"Display","value":"3 colores"},{"label":"UV","value":"Esterilización"},{"label":"Aromaterapia","value":"Integrada"}]),
          faqs: JSON.stringify([{"q":"¿Puedo elegir el color del display?","a":"Sí. Disponible en Gris y Negro, Blanco y Gris. Se elige en el momento del pedido."}]),
          warranty: JSON.stringify({"years":5,"details":"5 años tecnología · 10 años cerámica"}),
          stock: 999,
          active: true,
          sortOrder: 6,
        },
      ];

      let count = 0;
      for (const p of PRODUCTS_DATA) {
        await insertProduct(p as unknown as Parameters<typeof insertProduct>[0]); // gallery/features are JSON strings, cast needed
        count++;
      }
      return { success: true, message: `${count} productos añadidos a la base de datos`, count };
    }),

    // Payment methods management
    getPaymentMethods: adminProcedure.query(async () => {
      await seedDefaultPaymentMethods();
      return getAllPaymentMethods();
    }),
    togglePaymentMethod: adminProcedure
      .input(z.object({ key: z.string(), enabled: z.boolean() }))
      .mutation(async ({ input }) => {
        await togglePaymentMethod(input.key, input.enabled);
        return { success: true };
      }),
    updatePaymentMethod: adminProcedure
      .input(z.object({
        key: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        config: z.record(z.string(), z.string()).optional(),
        position: z.number().optional(),
        enabled: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { key, ...updates } = input;
        await updatePaymentMethodConfig(key, updates);
        return { success: true };
      }),
    // Orders management
    getOrders: adminProcedure.query(async () => getAllOrdersWithItems()),

    getOrder: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const order = await getOrderWithItems(input.id);
        if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Pedido no encontrado" });
        return order;
      }),

        updateOrderStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        await updateOrderStatus(input.id, input.status);
        return { success: true };
      }),

    uploadProductImage: adminProcedure
      .input(z.object({
        productId: z.number(),
        imageBase64: z.string(),
        imageType: z.enum(["main", "gallery"]),
        fileName: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.imageBase64, "base64");
        const ext = (input.fileName || "image.jpg").split(".").pop()?.toLowerCase() || "jpg";
        const mimeMap: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };
        const mime = mimeMap[ext] || "image/jpeg";
        const fileName = `product-${input.productId}-${Date.now()}.${ext}`;
        const { url } = await storagePut(`products/${fileName}`, buffer, mime);

        if (input.imageType === "main") {
          await updateProduct(input.productId, { img: url });
        } else {
          const product = await getProductById(input.productId);
          if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Producto no encontrado" });
          // Parsear gallery: puede ser string JSON, array, o null
          let gallery: string[] = [];
          if (Array.isArray(product.gallery)) {
            gallery = product.gallery as string[];
          } else if (typeof product.gallery === "string") {
            try { gallery = JSON.parse(product.gallery); } catch { gallery = []; }
          }
          gallery.push(url);
          await updateProduct(input.productId, { gallery: gallery as unknown as string[] });
        }
        return { success: true, url };
      }),

    removeProductImage: adminProcedure
      .input(z.object({
        productId: z.number(),
        imageUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        const product = await getProductById(input.productId);
        if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Producto no encontrado" });
        
        if (product.img === input.imageUrl) {
          await updateProduct(input.productId, { img: null });
        } else {
          // Parsear gallery: puede ser string JSON, array, o null
          let gallery: string[] = [];
          if (Array.isArray(product.gallery)) {
            gallery = product.gallery as string[];
          } else if (typeof product.gallery === "string") {
            try { gallery = JSON.parse(product.gallery); } catch { gallery = []; }
          }
          const filtered = gallery.filter(url => url !== input.imageUrl);
          await updateProduct(input.productId, { gallery: filtered as unknown as string[] });
        }
        return { success: true };
      }),
  }),

  // ─── CHATBOT IA ─────────────────────────────────────────────────────────────
  chat: router({
    message: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).min(1).max(40),
      }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        const products = await getAllProducts();
        const productMap = new Map(products.map(p => [p.slug, p]));

        const productSummary = products.map(p => {
          const highlights = typeof p.highlights === "string" ? JSON.parse(p.highlights) : (p.highlights ?? []);
          const features = typeof p.features === "string" ? JSON.parse(p.features) : (p.features ?? []);
          const hl = (highlights as { label: string; value: string }[]).map((h) => `${h.label}: ${h.value}`).join(" · ");
          const feat = (features as string[]).slice(0, 6).join(", ");
          return `**${p.name}** (slug: ${p.slug}) — ${p.price}€\n  ${p.tagline}\n  Highlights: ${hl}\n  Funciones: ${feat}`;
        }).join("\n\n");

        const systemPrompt = `Eres el asistente virtual de Elora Smart, una marca gallega de inodoros inteligentes de lujo. Tu misión es ayudar a los clientes a elegir el modelo que mejor se adapta a su baño y necesidades.

Sé cercano, profesional y conciso. Responde siempre en español. No inventes precios ni funciones que no aparezcan en el catálogo.

CATÁLOGO ACTUAL:
${productSummary}

IMPORTANTE: Cuando recomiendes uno o varios productos concretos, incluye al final de tu respuesta esta línea exacta (sin espacios extra):
RECOMENDACIONES:[slug1,slug2]

Ejemplo: RECOMENDACIONES:[esenza,aura-compact]

Si no recomiendas ningún producto concreto, no incluyas esa línea. Si el cliente quiere comprar, indícale que puede hacerlo directamente desde la web.`;

        const result = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...input.messages,
          ],
          maxTokens: 700,
        });

        const rawContent = result.choices[0]?.message?.content;
        if (typeof rawContent !== "string") throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Sin respuesta del modelo" });

        // Extraer slugs de recomendaciones y limpiar la línea del mensaje
        const recMatch = rawContent.match(/RECOMENDACIONES:\[([^\]]+)\]/);
        const reply = rawContent.replace(/\nRECOMENDACIONES:\[[^\]]+\]/, "").replace(/RECOMENDACIONES:\[[^\]]+\]/, "").trim();

        let recommendedProducts: { slug: string; name: string; price: string; img: string; tagline: string }[] = [];
        if (recMatch) {
          const slugs = recMatch[1].split(",").map(s => s.trim());
          recommendedProducts = slugs
            .map(slug => productMap.get(slug))
            .filter((p): p is NonNullable<typeof p> => !!p)
            .map(p => ({ slug: p.slug, name: p.name, price: String(p.price), img: p.img ?? "", tagline: p.tagline ?? "" }));
        }

        return { reply, recommendedProducts };
      }),
  }),

  // ─── CÓDIGOS POSTALES (España) ──────────────────────────────────────────────────────────
  geo: router({
    /** Busca por código postal exacto → devuelve municipios y provincia */
    lookupByCp: publicProcedure
      .input(z.object({ cp: z.string().length(5) }))
      .query(({ input }) => {
        const data = getCpData();
        const matches = data.filter(e => e.cp === input.cp);
        if (matches.length === 0) return null;
        // Devolver la primera coincidencia (municipio más común)
        return {
          cp: matches[0].cp,
          municipio: matches[0].municipio,
          provincia: matches[0].provincia,
          municipios: Array.from(new Set(matches.map(m => m.municipio))),
        };
      }),
    /** Busca por nombre de municipio (mín. 3 chars) → devuelve hasta 8 sugerencias */
    lookupByMunicipio: publicProcedure
      .input(z.object({ query: z.string().min(3).max(100) }))
      .query(({ input }) => {
        const data = getCpData();
        const q = input.query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const seen = new Set<string>();
        const results: { cp: string; municipio: string; provincia: string }[] = [];
        for (const e of data) {
          const norm = e.municipio.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          if (norm.startsWith(q)) {
            const key = `${e.cp}-${e.municipio}`;
            if (!seen.has(key)) {
              seen.add(key);
              results.push(e);
              if (results.length >= 8) break;
            }
          }
        }
        return results;
      }),
  }),
});
export type AppRouter = typeof appRouter;
