import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatSuggestions, mockAiReply } from "@/lib/mock-data";
function AssistantPage() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm your AI Investment Assistant. Ask me anything about mutual funds, PPF, tax saving, or your portfolio." },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const endRef = useRef(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);
    const send = (text) => {
        const trimmed = text.trim();
        if (!trimmed)
            return;
        setMessages((m) => [...m, { role: "user", content: trimmed }]);
        setInput("");
        setTyping(true);
        setTimeout(() => {
            setMessages((m) => [...m, { role: "assistant", content: mockAiReply(trimmed) }]);
            setTyping(false);
        }, 700);
    };
    return (<div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">AI Financial Assistant</h1>
        <p className="mt-1 text-muted-foreground">Ask anything about investments in plain English.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (<motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (<div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4"/>
                </div>)}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}>
                {m.content}
              </div>
              {m.role === "user" && (<div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-foreground">
                  <User className="h-4 w-4"/>
                </div>)}
            </motion.div>))}
          {typing && (<div className="flex gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-4 w-4"/>
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (<motion.span key={i} className="h-2 w-2 rounded-full bg-muted-foreground/60" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}/>))}
              </div>
            </div>)}
          <div ref={endRef}/>
        </div>

        <div className="border-t border-border p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {chatSuggestions.map((q) => (<button key={q} onClick={() => send(q)} className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                {q}
              </button>))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." className="rounded-xl"/>
            <Button type="submit" size="icon" className="rounded-xl h-10 w-10 shrink-0">
              <Send className="h-4 w-4"/>
            </Button>
          </form>
        </div>
      </div>
    </div>);
}

export default AssistantPage;
