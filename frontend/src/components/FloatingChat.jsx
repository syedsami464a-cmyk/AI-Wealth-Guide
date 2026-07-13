import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatSuggestions, mockAiReply } from "@/lib/mock-data";
export function FloatingChat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm your AI Investment Assistant. Ask me about FD, RD, PPF, NPS, Gold ETF or Mutual Funds." },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const endRef = useRef(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing, open]);
    const send = (text) => {
        const t = text.trim();
        if (!t)
            return;
        setMessages((m) => [...m, { role: "user", content: t }]);
        setInput("");
        setTyping(true);
        setTimeout(() => {
            setMessages((m) => [...m, { role: "assistant", content: mockAiReply(t) }]);
            setTyping(false);
        }, 600);
    };
    return (<>
      <AnimatePresence>
        {open && (<motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.2 }} className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[560px] rounded-2xl border border-border bg-card shadow-elevated flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary to-secondary text-primary-foreground">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-white/20"><Bot className="h-4 w-4"/></div>
                <div>
                  <div className="text-sm font-semibold leading-tight">AI Advisor</div>
                  <div className="text-[10px] opacity-80">Online · usually replies instantly</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/20"><X className="h-4 w-4"/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-background/50">
              {messages.map((m, i) => (<div key={i} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}>{m.content}</div>
                </div>))}
              {typing && (<div className="flex"><div className="bg-muted rounded-2xl px-3 py-2 flex gap-1">
                  {[0, 1, 2].map(i => <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}/>)}
                </div></div>)}
              <div ref={endRef}/>
            </div>
            <div className="border-t border-border p-2.5 space-y-2 bg-card">
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {chatSuggestions.slice(0, 3).map((q) => (<button key={q} onClick={() => send(q)} className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground">
                    {q}
                  </button>))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." className="rounded-xl h-9"/>
                <Button type="submit" size="icon" className="rounded-xl h-9 w-9 shrink-0"><Send className="h-4 w-4"/></Button>
              </form>
            </div>
          </motion.div>)}
      </AnimatePresence>

      {!open && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-24 right-4 sm:right-6 z-40 hidden sm:flex items-center gap-2 rounded-2xl bg-card border border-border shadow-elevated px-3 py-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-secondary/15 text-secondary"><Sparkles className="h-4 w-4"/></div>
          <div>
            <div className="text-[10px] text-muted-foreground leading-none">AI Suggestion</div>
            <div className="text-xs font-semibold">Chat with your advisor</div>
          </div>
        </motion.div>)}

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setOpen((o) => !o)} aria-label="Open AI chat" className="fixed bottom-5 right-4 sm:right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-elevated hover:shadow-2xl">
        {open ? <X className="h-6 w-6"/> : <MessageCircle className="h-6 w-6"/>}
      </motion.button>
    </>);
}
