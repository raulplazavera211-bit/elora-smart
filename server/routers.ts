import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import {
  insertContactSubmission,
  insertClubEloraSignup,
} from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  /**
   * Contact form — "Solicitar catálogo privado"
   * Saves the submission to the database and notifies the owner.
   */
  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          nombre: z.string().min(1, "El nombre es obligatorio").max(255),
          telefono: z.string().max(64).optional(),
          email: z.string().email("Email inválido").max(320),
          mensaje: z.string().max(5000).optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Save to database
        const id = await insertContactSubmission({
          nombre: input.nombre,
          telefono: input.telefono ?? null,
          email: input.email,
          mensaje: input.mensaje ?? null,
        });

        // Notify owner (fire-and-forget — don't fail if notification fails)
        notifyOwner({
          title: `📬 Nuevo contacto: ${input.nombre}`,
          content: [
            `Nombre: ${input.nombre}`,
            `Email: ${input.email}`,
            input.telefono ? `Teléfono: ${input.telefono}` : null,
            input.mensaje ? `Mensaje:\n${input.mensaje}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        }).catch(err => console.warn("[Contact] Notification failed:", err));

        return { success: true, id };
      }),
  }),

  /**
   * Club Elora newsletter signup.
   * Saves the signup to the database and notifies the owner.
   */
  clubElora: router({
    signup: publicProcedure
      .input(
        z.object({
          nombre: z.string().max(255).optional(),
          email: z.string().email("Email inválido").max(320),
        })
      )
      .mutation(async ({ input }) => {
        const { id, alreadyExists } = await insertClubEloraSignup({
          nombre: input.nombre ?? null,
          email: input.email,
        });

        if (!alreadyExists) {
          // Notify owner about the new member
          notifyOwner({
            title: `⭐ Nuevo miembro del Club Elora`,
            content: [
              `Email: ${input.email}`,
              input.nombre ? `Nombre: ${input.nombre}` : null,
            ]
              .filter(Boolean)
              .join("\n"),
          }).catch(err => console.warn("[ClubElora] Notification failed:", err));
        }

        return { success: true, alreadyExists };
      }),
  }),
});

export type AppRouter = typeof appRouter;
