"use client";

import { useState } from "react";
import {
  DEFAULT_HOME_STATEMENTS,
  type HomeStatement,
  type HomeStatementsContent,
} from "@/app/lib/home-statements-shared";
import { updateHomeStatementsAction } from "@/app/admin/actions";

const EMPTY: HomeStatement = {
  id: "",
  lead: "",
  mark: "",
  rest: "",
};

export default function StatementsManager({
  initialContent,
}: {
  initialContent: HomeStatementsContent;
}) {
  const [content, setContent] = useState<HomeStatementsContent>(initialContent);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeId, setActiveId] = useState(initialContent.statements[0]?.id || "");

  const active = content.statements.find((item) => item.id === activeId) || content.statements[0];

  async function persist(next: HomeStatementsContent) {
    setLoading(true);
    setMessage("");
    const result = await updateHomeStatementsAction(next);
    if (result.success) {
      setMessage("Home statement cards updated.");
      setTimeout(() => setMessage(""), 2500);
    } else {
      setMessage("Error: " + result.error);
    }
    setLoading(false);
  }

  function updateStatement(id: string, patch: Partial<HomeStatement>) {
    setContent((prev) => ({
      statements: prev.statements.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  function addStatement() {
    const id = `statement-${Date.now()}`;
    const next = {
      statements: [
        ...content.statements,
        { ...EMPTY, id, lead: "Introducing", mark: "something new", rest: "on the home page" },
      ],
    };
    setContent(next);
    setActiveId(id);
  }

  function removeStatement(id: string) {
    if (content.statements.length <= 1) {
      setMessage("Keep at least one statement card.");
      return;
    }
    if (!confirm("Remove this statement card from the homepage?")) return;
    const statements = content.statements.filter((item) => item.id !== id);
    const next = { statements };
    setContent(next);
    setActiveId(statements[0]?.id || "");
    void persist(next);
  }

  function moveStatement(id: string, direction: -1 | 1) {
    const index = content.statements.findIndex((item) => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= content.statements.length) return;
    const statements = [...content.statements];
    const [row] = statements.splice(index, 1);
    statements.splice(target, 0, row);
    setContent({ statements });
  }

  function resetDefaults() {
    if (!confirm("Reset to the default Skytech statement cards?")) return;
    setContent(DEFAULT_HOME_STATEMENTS);
    setActiveId(DEFAULT_HOME_STATEMENTS.statements[0]?.id || "");
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Home statement cards</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            These are the pinned scroll lines under the hero — lead text, highlighted mark, and the rest of the sentence.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addStatement}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Add card
          </button>
          <button
            type="button"
            onClick={resetDefaults}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Reset defaults
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void persist(content)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {message ? (
        <p className={`rounded-xl px-4 py-3 text-sm ${message.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {message}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
          {content.statements.map((item, index) => {
            const activeRow = item.id === active?.id;
            return (
              <div key={item.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`min-w-0 flex-1 rounded-xl px-3 py-2.5 text-left text-sm font-medium ${
                    activeRow ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="block truncate">{item.mark || `Card ${index + 1}`}</span>
                  <span className={`mt-0.5 block truncate text-xs ${activeRow ? "text-white/70" : "text-slate-500"}`}>
                    {item.lead || "Empty lead"}
                  </span>
                </button>
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    aria-label="Move up"
                    onClick={() => moveStatement(item.id, -1)}
                    className="rounded-md px-1.5 text-xs text-slate-500 hover:bg-slate-100"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    onClick={() => moveStatement(item.id, 1)}
                    className="rounded-md px-1.5 text-xs text-slate-500 hover:bg-slate-100"
                  >
                    ↓
                  </button>
                </div>
              </div>
            );
          })}
        </aside>

        {active ? (
          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Edit card</h2>
              <button
                type="button"
                onClick={() => removeStatement(active.id)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lead</span>
              <input
                value={active.lead}
                onChange={(event) => updateStatement(active.id, { lead: event.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                placeholder="Even after launch, the work stays with"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Highlighted mark</span>
              <input
                value={active.mark}
                onChange={(event) => updateStatement(active.id, { mark: event.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                placeholder="Skytech Ghana"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rest</span>
              <input
                value={active.rest}
                onChange={(event) => updateStatement(active.id, { rest: event.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                placeholder="in Accra."
              />
            </label>

            <div className="rounded-2xl bg-[#f6f6f4] px-6 py-10 text-center">
              <p className="font-serif text-2xl font-medium leading-tight tracking-tight text-slate-900 md:text-3xl">
                {active.lead}{" "}
                <span className="rounded-full bg-[#d5f5a8] px-3">{active.mark || "…"}</span>{" "}
                {active.rest}
              </p>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
