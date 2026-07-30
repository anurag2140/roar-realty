"use client";

import { useCallback, useEffect, useState } from "react";
import type { Tool } from "sanity";

/**
 * Leads inbox, mounted as a top-level Studio tool.
 *
 * Leads live in Neon, not Sanity — Sanity's free plan only offers public-read
 * datasets, and customer phone numbers must not be world-readable. This panel
 * talks to our own /api/leads endpoint, which is password-gated.
 */

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  budget: string | null;
  propertyName: string | null;
  propertySlug: string | null;
  sourcePage: string | null;
  formType: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  status: "new" | "contacted" | "qualified" | "closed";
  notes: string | null;
  createdAt: string;
};

const STATUSES = ["new", "contacted", "qualified", "closed"] as const;

const STATUS_COLOR: Record<string, string> = {
  new: "#E8CD8F",
  contacted: "#8FB3E8",
  qualified: "#8FE8A6",
  closed: "#8A8A8A",
};

function LeadsPanel() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async (pw: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/leads?status=${encodeURIComponent(filter)}&q=${encodeURIComponent(search)}`,
          { headers: { "x-leads-password": pw } }
        );
        if (res.status === 401) {
          setError("Wrong password.");
          setAuthed(false);
          return;
        }
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        setLeads(data.leads ?? []);
        setAuthed(true);
        sessionStorage.setItem("roar_leads_pw", pw);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load leads.");
      } finally {
        setLoading(false);
      }
    },
    [filter, search]
  );

  useEffect(() => {
    const saved = sessionStorage.getItem("roar_leads_pw");
    if (saved) {
      setPassword(saved);
      void load(saved);
    }
    // Intentionally runs once; `load` changes with filter/search which the
    // second effect handles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authed) void load(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search, authed]);

  async function updateLead(id: number, patch: Partial<Lead>) {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-leads-password": password,
      },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    }
  }

  function exportCsv() {
    const header = [
      "id", "created", "name", "phone", "email", "budget", "property",
      "form", "source page", "utm_source", "utm_campaign", "status", "message", "notes",
    ];
    const rows = leads.map((l) => [
      l.id, l.createdAt, l.name, l.phone, l.email ?? "", l.budget ?? "",
      l.propertyName ?? "", l.formType, l.sourcePage ?? "", l.utmSource ?? "",
      l.utmCampaign ?? "", l.status, (l.message ?? "").replace(/\s+/g, " "),
      (l.notes ?? "").replace(/\s+/g, " "),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `roar-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <div style={{ padding: 48, maxWidth: 420, fontFamily: "system-ui, sans-serif" }}>
        <h2 style={{ margin: "0 0 8px" }}>Leads</h2>
        <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6, marginTop: 0 }}>
          Enquiries are stored in a private database, separate from your content.
          Enter the leads password to view them.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void load(password);
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leads password"
            autoComplete="current-password"
            style={{
              width: "100%", padding: "10px 12px", fontSize: 14,
              border: "1px solid #ccc", borderRadius: 4, marginBottom: 12,
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px", fontSize: 14, cursor: "pointer",
              background: "#C6A15B", color: "#0A0907", border: "none", borderRadius: 4,
            }}
          >
            {loading ? "Checking…" : "Open inbox"}
          </button>
        </form>
        {error && <p style={{ color: "#c33", fontSize: 13 }}>{error}</p>}
      </div>
    );
  }

  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s).length;
    return acc;
  }, {});

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif", height: "100%", overflow: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>Leads</h2>
        <span style={{ color: "#888", fontSize: 13 }}>{leads.length} shown</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, property…"
            style={{ padding: "7px 10px", fontSize: 13, border: "1px solid #ccc", borderRadius: 4, minWidth: 220 }}
          />
          <button
            onClick={exportCsv}
            style={{ padding: "7px 14px", fontSize: 13, cursor: "pointer", border: "1px solid #ccc", borderRadius: 4, background: "#fff" }}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "6px 14px", fontSize: 12, cursor: "pointer", borderRadius: 999,
              textTransform: "capitalize",
              border: filter === s ? "1px solid #C6A15B" : "1px solid #ddd",
              background: filter === s ? "#C6A15B" : "#fff",
              color: filter === s ? "#0A0907" : "#333",
            }}
          >
            {s}
            {s !== "all" && counts[s] ? ` (${counts[s]})` : ""}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: "#888" }}>Loading…</p>}
      {error && <p style={{ color: "#c33" }}>{error}</p>}
      {!loading && !leads.length && (
        <p style={{ color: "#888" }}>
          No leads yet. They&apos;ll appear here the moment someone submits a form.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {leads.map((l) => (
          <div
            key={l.id}
            style={{
              border: "1px solid #e3e3e3", borderRadius: 6, padding: 16,
              borderLeft: `4px solid ${STATUS_COLOR[l.status]}`, background: "#fff",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
              <strong style={{ fontSize: 15 }}>{l.name}</strong>
              <a href={`tel:${l.phone}`} style={{ fontSize: 14, color: "#0645ad" }}>{l.phone}</a>
              {l.email && (
                <a href={`mailto:${l.email}`} style={{ fontSize: 13, color: "#0645ad" }}>{l.email}</a>
              )}
              <span style={{ marginLeft: "auto", fontSize: 12, color: "#999" }}>
                {new Date(l.createdAt).toLocaleString("en-IN")}
              </span>
            </div>

            {l.propertyName && (
              <div style={{ fontSize: 13, color: "#555", marginTop: 6 }}>
                Interested in <strong>{l.propertyName}</strong>
              </div>
            )}
            {l.budget && (
              <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>Budget: {l.budget}</div>
            )}
            {l.message && (
              <p style={{ fontSize: 14, margin: "8px 0 0", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
                {l.message}
              </p>
            )}

            <div style={{ fontSize: 11, color: "#aaa", marginTop: 8 }}>
              {l.formType}
              {l.sourcePage ? ` · ${l.sourcePage}` : ""}
              {l.utmSource ? ` · ${l.utmSource}/${l.utmCampaign ?? "—"}` : ""}
            </div>

            <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => void updateLead(l.id, { status: s })}
                  style={{
                    padding: "4px 11px", fontSize: 11, cursor: "pointer", borderRadius: 999,
                    textTransform: "capitalize",
                    border: l.status === s ? `1px solid ${STATUS_COLOR[s]}` : "1px solid #ddd",
                    background: l.status === s ? STATUS_COLOR[s] : "#fff",
                    fontWeight: l.status === s ? 600 : 400,
                  }}
                >
                  {s}
                </button>
              ))}
              <a
                href={`https://wa.me/${l.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 12, marginLeft: "auto", color: "#25D366", fontWeight: 600 }}
              >
                WhatsApp →
              </a>
            </div>

            <textarea
              defaultValue={l.notes ?? ""}
              placeholder="Notes…"
              onBlur={(e) => {
                if (e.target.value !== (l.notes ?? "")) {
                  void updateLead(l.id, { notes: e.target.value });
                }
              }}
              style={{
                width: "100%", marginTop: 10, padding: 8, fontSize: 13, minHeight: 40,
                border: "1px solid #e3e3e3", borderRadius: 4, resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export const leadsTool: Tool = {
  name: "leads",
  title: "Leads",
  component: LeadsPanel,
};
