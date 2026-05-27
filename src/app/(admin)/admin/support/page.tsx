"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Plus,
  X,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Ticket {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  user: { id: string; email: string; name: string | null };
  metadata: { status?: string; priority?: string };
}

const priorityColors: Record<string, string> = {
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  high: "bg-vivid-accent/10 text-vivid-accent border-vivid-accent/20",
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusColors: Record<string, string> = {
  open: "bg-vivid-primary/10 text-vivid-primary border-vivid-primary/20",
  in_progress: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  resolved: "bg-green-500/10 text-green-400 border-green-500/20",
  closed: "bg-white/5 text-vivid-textDim border-white/10",
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: "", description: "", priority: "medium" });

  const fetchTickets = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/admin/tickets?${params}`);
    const data = await res.json();
    setTickets(data.tickets || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTicket),
    });
    toast.success("Ticket created");
    setShowCreate(false);
    setNewTicket({ title: "", description: "", priority: "medium" });
    fetchTickets();
  };

  const updateStatus = async (ticketId: string, status: string) => {
    await fetch("/api/admin/tickets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId, status }),
    });
    toast.success("Ticket status updated");
    fetchTickets();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Support Tickets</h1>
          <p className="text-vivid-textMuted">Manage customer support requests</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-vivid-primary/50"
          >
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <button
            onClick={() => setShowCreate(true)}
            className="h-10 px-4 rounded-xl bg-vivid-primary text-vivid-bg font-semibold text-sm flex items-center gap-2 hover:bg-vivid-primaryDim transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>
      </div>

      {/* Create Ticket Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-vivid-border/50 bg-vivid-surface/95 backdrop-blur-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Create Support Ticket</h2>
                <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-vivid-textDim hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={createTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-vivid-textMuted mb-1.5">Title</label>
                  <input
                    value={newTicket.title}
                    onChange={(e) => setNewTicket((t) => ({ ...t, title: e.target.value }))}
                    required
                    className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-vivid-textDim focus:border-vivid-primary/50 outline-none text-sm"
                    placeholder="Brief description of the issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-vivid-textMuted mb-1.5">Description</label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket((t) => ({ ...t, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-vivid-textDim focus:border-vivid-primary/50 outline-none text-sm resize-none"
                    placeholder="Detailed description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-vivid-textMuted mb-1.5">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket((t) => ({ ...t, priority: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-vivid-primary/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-vivid-primary text-vivid-bg font-semibold hover:bg-vivid-primaryDim transition-colors"
                >
                  Create Ticket
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tickets List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))
        ) : tickets.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-vivid-border/50 bg-vivid-surface/40">
            <HelpCircle className="w-12 h-12 text-vivid-textDim mx-auto mb-4" />
            <p className="text-lg font-semibold text-white mb-2">No tickets found</p>
            <p className="text-sm text-vivid-textMuted">Create a new ticket to get started</p>
          </div>
        ) : (
          tickets.map((ticket, i) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-5 hover:bg-vivid-surface/60 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-4 h-4 text-vivid-primary" />
                    <h3 className="text-sm font-semibold text-white">{ticket.title}</h3>
                  </div>
                  {ticket.description && (
                    <p className="text-sm text-vivid-textMuted mb-3 line-clamp-2">{ticket.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-vivid-textDim">
                    <span>{ticket.user?.email || "System"}</span>
                    <span>·</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border",
                    priorityColors[ticket.metadata?.priority || "medium"]
                  )}>
                    <AlertTriangle className="w-3 h-3" />
                    {ticket.metadata?.priority || "medium"}
                  </span>
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border",
                    statusColors[ticket.metadata?.status || "open"]
                  )}>
                    {ticket.metadata?.status === "resolved" && <CheckCircle2 className="w-3 h-3" />}
                    {ticket.metadata?.status === "open" && <Clock className="w-3 h-3" />}
                    {(ticket.metadata?.status || "open").replace("_", " ")}
                  </span>
                  <select
                    value={ticket.metadata?.status || "open"}
                    onChange={(e) => updateStatus(ticket.id, e.target.value)}
                    className="h-7 px-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-vivid-primary/50"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
