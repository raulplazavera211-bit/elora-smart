import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

type Message = {
  role: "user" | "assistant";
  content: string;
  recommendedProducts?: { slug: string; name: string; price: string; img: string; tagline: string }[];
  showHumanContact?: boolean;
};

const PHONE_NUMBER = "+34614451901";
const PHONE_CLEAN = "34614451901";
const WA_HUMAN_URL = `https://wa.me/${PHONE_CLEAN}?text=Hola%2C%20me%20gustar%C3%ADa%20hablar%20con%20alguien%20del%20equipo%20Elora%20Smart`;
const CALL_URL = `tel:+34614451901`;

const SUGGESTED = [
  "¿Qué modelo me recomiendas?",
  "¿Cuál es el más económico?",
  "¿Necesito obra para instalarlo?",
];

const WA_NUMBER = "34614451901";
const WA_URL = `https://wa.me/${WA_NUMBER}?text=Hola%2C%20me%20gustar%C3%ADa%20hablar%20con%20alguien%20del%20equipo%20Elora%20Smart`;

// Icono SVG personalizado: silueta de chat con chispa
function EloraIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Burbuja de chat */}
      <path
        d="M6 8C6 5.79 7.79 4 10 4H30C32.21 4 34 5.79 34 8V24C34 26.21 32.21 28 30 28H22L14 36V28H10C7.79 28 6 26.21 6 24V8Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Chispa / estrella */}
      <path
        d="M20 11L21.5 15.5H26L22.25 18.25L23.75 22.75L20 20L16.25 22.75L17.75 18.25L14 15.5H18.5L20 11Z"
        fill="#c9a96e"
        stroke="#c9a96e"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hasUnread, setHasUnread] = useState(false);
  const [hideForExperience, setHideForExperience] = useState(false);
  const [, navigate] = useLocation();
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAssistantRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Ocultar el botón flotante cuando la sección de Experiencia está en vista
  useEffect(() => {
    const handler = (e: Event) => {
      const visible = (e as CustomEvent).detail?.visible;
      setHideForExperience(!!visible);
      if (visible) setOpen(false); // cerrar el chat si estaba abierto
    };
    window.addEventListener('experience-section-visible', handler);
    return () => window.removeEventListener('experience-section-visible', handler);
  }, []);

  const chatMutation = trpc.chat.message.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          recommendedProducts: data.recommendedProducts,
          showHumanContact: data.showHumanContact,
        },
      ]);
      if (!open) setHasUnread(true);
    },
  });

  // Cuando el usuario envía → bajar al final (ver su propio mensaje)
  // Cuando el bot responde → subir al inicio de su respuesta para leerla desde arriba
  const prevLengthRef = useRef(0);
  useEffect(() => {
    const newLength = messages.length;
    if (newLength === 0) return;
    const lastMsg = messages[newLength - 1];
    if (lastMsg.role === "user") {
      // Mensaje del usuario: bajar al final
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Respuesta del bot: ir al inicio de ese mensaje para leerlo desde arriba
      lastAssistantRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    prevLengthRef.current = newLength;
  }, [messages]);

  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || chatMutation.isPending) return;
    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    chatMutation.mutate({
      messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const goToProduct = (productId: string) => {
    setOpen(false);
    navigate(`/coleccion?producto=${encodeURIComponent(productId)}`);
  };

  return (
    <>
      {/* Panel del chat */}
      <div
        className={cn(
          "fixed bottom-20 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm",
          "bg-background border border-border shadow-2xl flex flex-col",
          "transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        style={{ height: "460px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-foreground text-background shrink-0">
          <div className="flex items-center gap-2.5">
            <EloraIcon className="w-7 h-7 text-background shrink-0" />
            <div>
              <p className="font-body text-[10px] uppercase tracking-[0.25em] leading-none">
                Asistente Elora
              </p>
              <p className="font-body text-[9px] text-background/50 tracking-wide mt-0.5">
                Te ayudo a elegir tu modelo
              </p>
            </div>
          </div>
          {/* WhatsApp + cerrar */}
          <div className="flex items-center gap-2">
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366] text-white px-2.5 py-1 text-[9px] font-body uppercase tracking-wider hover:bg-[#1ebe5a] transition-colors"
              title="Hablar con un humano"
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="hidden xs:inline">Hablar con humano</span>
              <span className="xs:hidden">Humano</span>
            </a>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:text-[#c9a96e] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="flex flex-col gap-4 h-full justify-center">
              <div className="text-center">
                <EloraIcon className="w-10 h-10 text-foreground/20 mx-auto mb-2" />
                <p className="font-body text-xs text-foreground/60 leading-relaxed">
                  Hola, soy el asistente de Elora Smart.<br />
                  ¿En qué puedo ayudarte?
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={chatMutation.isPending}
                    className="text-left font-body text-[11px] border border-border px-3 py-2 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors disabled:opacity-40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className="flex flex-col gap-2"
              ref={m.role === "assistant" && i === messages.length - 1 ? lastAssistantRef : undefined}
            >
              <div
                className={cn(
                  "flex gap-2 items-start",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <EloraIcon className="w-4 h-4 text-background" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[82%] px-3 py-2 leading-relaxed",
                    m.role === "user"
                      ? "bg-foreground text-background font-body text-xs"
                      : "bg-muted text-foreground"
                  )}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-xs">
                      <Streamdown>{m.content}</Streamdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-xs">{m.content}</p>
                  )}
                </div>
              </div>

              {/* Botones de contacto humano */}
              {m.role === "assistant" && m.showHumanContact && (
                <div className="flex gap-2 ml-8 mt-1">
                  <a
                    href={WA_HUMAN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366] text-white px-3 py-2 text-[11px] font-body uppercase tracking-wider hover:bg-[#1ebe5a] transition-colors flex-1 justify-center"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                  <a
                    href={CALL_URL}
                    className="flex items-center gap-2 bg-foreground text-background px-3 py-2 text-[11px] font-body uppercase tracking-wider hover:bg-[#c9a96e] transition-colors flex-1 justify-center"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    Llamar
                  </a>
                </div>
              )}

              {/* Tarjetas de productos recomendados */}
              {m.role === "assistant" && m.recommendedProducts && m.recommendedProducts.length > 0 && (
                <div className="flex flex-col gap-2 ml-8">
                  {m.recommendedProducts.map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => goToProduct(p.slug)}
                      className="flex items-center gap-3 border border-border bg-background hover:border-[#c9a96e] transition-colors p-2 text-left group"
                    >
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-14 h-14 object-cover shrink-0 bg-muted"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-xs uppercase tracking-wide leading-tight truncate group-hover:text-[#c9a96e] transition-colors">
                          {p.name}
                        </p>
                        <p className="font-body text-[10px] text-foreground/50 leading-tight mt-0.5 line-clamp-1">
                          {p.tagline}
                        </p>
                        <p className="font-display text-sm mt-1 text-foreground">
                          {Number(p.price).toLocaleString("es-ES")} €
                        </p>
                      </div>
                      <span className="font-body text-[9px] uppercase tracking-widest text-[#c9a96e] shrink-0 pr-1">
                        Ver →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {chatMutation.isPending && (
            <div className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center shrink-0">
                <EloraIcon className="w-4 h-4 text-background" />
              </div>
              <div className="bg-muted px-3 py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-foreground/40" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 p-3 border-t border-border shrink-0 bg-background"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Escribe tu pregunta..."
            rows={1}
            className="flex-1 resize-none bg-muted border-0 outline-none font-body text-xs px-3 py-2 max-h-20 text-foreground placeholder:text-foreground/40"
          />
          <button
            type="submit"
            disabled={!input.trim() || chatMutation.isPending}
            className="w-8 h-8 bg-foreground text-background flex items-center justify-center shrink-0 hover:bg-[#c9a96e] transition-colors disabled:opacity-40 self-end"
          >
            {chatMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </form>
      </div>

      {/* Botón flotante con icono + etiqueta — se oculta en la sección Experiencia */}
      <div
        className="fixed bottom-6 right-5 z-50 flex items-center gap-3 transition-all duration-300"
        style={{
          opacity: hideForExperience ? 0 : 1,
          pointerEvents: hideForExperience ? 'none' : 'auto',
          transform: hideForExperience ? 'translateY(20px) scale(0.9)' : 'translateY(0) scale(1)',
        }}
      >
        {/* Etiqueta pill — solo cuando está cerrado */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="bg-white text-[#1a1a1a] font-body text-[11px] tracking-wide px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.2)] transition-all duration-200 whitespace-nowrap border border-[#e8e0d5]"
          >
            ¿Tienes alguna duda?
          </button>
        )}

        {/* Botón icono circular */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "relative w-14 h-14 rounded-full flex items-center justify-center",
            "shadow-[0_8px_30px_rgba(201,169,110,0.5)] hover:shadow-[0_12px_36px_rgba(201,169,110,0.65)]",
            "transition-all duration-200 active:scale-95 hover:scale-105",
            open
              ? "bg-[#1a1a1a] text-white"
              : "bg-gradient-to-br from-[#d4a96a] to-[#b8935a] text-white"
          )}
          aria-label="Abrir asistente Elora"
        >
          {open ? (
            <X className="w-5 h-5" />
          ) : (
            <EloraIcon className="w-7 h-7" />
          )}
          {hasUnread && !open && (
            <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
      </div>
    </>
  );
}
