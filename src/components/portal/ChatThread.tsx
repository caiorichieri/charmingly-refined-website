import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: string;
  athlete_id: string;
  therapist_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

type Props = {
  athleteId: string;
  therapistId: string;
  currentUserId: string;
};

export function ChatThread({ athleteId, therapistId, currentUserId }: Props) {
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryKey = ["chat", athleteId, therapistId];

  const { data: messages = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("athlete_id", athleteId)
        .eq("therapist_id", therapistId)
        .order("created_at", { ascending: true })
        .limit(500);
      if (error) throw error;
      return data as Message[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`chat:${athleteId}:${therapistId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `athlete_id=eq.${athleteId}`,
        },
        (payload) => {
          const m = payload.new as Message;
          if (m.therapist_id !== therapistId) return;
          qc.setQueryData<Message[]>(queryKey, (prev = []) =>
            prev.some((p) => p.id === m.id) ? prev : [...prev, m]
          );
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [athleteId, therapistId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      athlete_id: athleteId,
      therapist_id: therapistId,
      sender_id: currentUserId,
      body,
    });
    setSending(false);
    if (error) {
      toast.error("Errore invio messaggio");
      return;
    }
    setText("");
    qc.invalidateQueries({ queryKey });
  }

  return (
    <div className="flex flex-col h-[420px] bg-off rounded-xl border border-line">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Caricamento…</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nessun messaggio. Inizia la conversazione!
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === currentUserId;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap ${
                    mine
                      ? "bg-brand-green text-white rounded-br-sm"
                      : "bg-white border border-line text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.body}
                  <div className={`text-[10px] mt-1 ${mine ? "text-white/70" : "text-muted-foreground"}`}>
                    {new Date(m.created_at).toLocaleString("it-IT", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-line bg-white rounded-b-xl">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Scrivi un messaggio…"
          maxLength={4000}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-line focus:outline-none focus:ring-2 focus:ring-brand-green/30"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-brand-green text-white rounded-lg hover:brightness-110 disabled:opacity-50 transition"
        >
          <Send size={14} /> Invia
        </button>
      </form>
    </div>
  );
}
