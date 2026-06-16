import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "¿Qué modelo me recomiendas?",
  "¿Cuál es el más económico?",
  "¿Necesito obra para instalarlo?",
];

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chatMutation = trpc.chat.message.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      if (!open) setHasUnread(true);
    },
  });

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatMutation.isPending]);

  // Quitar badge al abrir
  useEffect(() => {
    if (open) setHasUnread(false);
  }, [open]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || chatMutation.isPending) return;
    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    chatMutation.mutate({ messages: newMessages });
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

  return (
    <>
      {/* Panel del chat */}
      <div
        className={cn(
          "fixed bottom-20 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm",
          "bg-background border border-border shadow-2xl",
          "flex flex-col transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        style={{ height: "420px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-foreground text-background shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c9a96e]" />
            <div>
              <p className="font-body text-[10px] uppercase tracking-[0.25em] leading-none">Asistente Elora</p>
              <p className="font-body text-[9px] text-background/50 tracking-wide mt-0.5">Te ayudo a elegir tu modelo</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 hover:text-[#c9a96e] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="flex flex-col gap-4 h-full justify-center">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-[#c9a96e] mx-auto mb-2 opacity-60" />
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
              className={cn(
                "flex gap-2 items-start",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {m.role === "assistant" && (
                <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-[#c9a96e]" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[82%] px-3 py-2 text-sm leading-relaxed",
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
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            </div>
          ))}

          {chatMutation.isPending && (
            <div className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-[#c9a96e]" />
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

      {/* Botón flotante */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-4 right-4 z-50 w-12 h-12",
          "bg-foreground text-background shadow-lg",
          "flex items-center justify-center",
          "hover:bg-[#c9a96e] transition-colors duration-200",
          "active:scale-95"
        )}
        aria-label="Abrir asistente Elora"
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageCircle className="w-5 h-5" />
        )}
        {hasUnread && !open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#c9a96e] rounded-full" />
        )}
      </button>
    </>
  );
}
