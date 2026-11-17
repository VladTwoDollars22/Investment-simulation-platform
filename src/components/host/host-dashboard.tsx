"use client";

import {
  Check,
  Copy,
  Crown,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Plus,
  QrCode,
  Radio,
  RefreshCw,
  Trophy,
  Users,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import type {
  CreatedGame,
  LeaderboardEntry,
} from "@/lib/game-types";
import { createGame, fetchLeaderboard } from "@/lib/game-client";
import { useI18n } from "@/lib/i18n";
import { STARTING_BUDGET } from "@/lib/startup-types";
import { cn, formatCurrency } from "@/lib/utils";

const HOST_ROOM_KEY = "starcup.host.room";
const POLL_MS = 10_000;

type HostRoom = CreatedGame;

function readStoredRoom(): HostRoom | null {
  try {
    const raw = window.localStorage.getItem(HOST_ROOM_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<HostRoom>;

    if (
      typeof parsed.id === "string" &&
      typeof parsed.roomCode === "string" &&
      typeof parsed.unlockCode === "string" &&
      typeof parsed.createdAt === "string"
    ) {
      return {
        id: parsed.id,
        roomCode: parsed.roomCode,
        unlockCode: parsed.unlockCode,
        createdAt: parsed.createdAt,
      };
    }

    return null;
  } catch {
    return null;
  }
}

function returnPercent(finalBalance: number) {
  return ((finalBalance - STARTING_BUDGET) / STARTING_BUDGET) * 100;
}

function formatReturn(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function HostDashboard() {
  const { dict, language, t } = useI18n();
  const copy = dict.host;
  const [room, setRoom] = useState<HostRoom | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [codeVisible, setCodeVisible] = useState(false);
  const [polling, setPolling] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const inFlight = useRef(false);
  const activeRoomRef = useRef<string | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const stored = readStoredRoom();
      if (stored) setRoom(stored);
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    activeRoomRef.current = room?.roomCode ?? null;
    inFlight.current = false;
  }, [room]);

  const joinUrl =
    room && hydrated
      ? `${window.location.origin}/play/${encodeURIComponent(room.roomCode)}`
      : "";

  const refresh = useCallback(
    async ({ silent = false } = {}) => {
      if (!room || inFlight.current) return;

      inFlight.current = true;
      if (silent) setRefreshing(true);
      else setLoading(true);

      try {
        const payload = await fetchLeaderboard(room.roomCode);

        if (activeRoomRef.current !== room.roomCode) return;

        setEntries(payload.submissions);
        setLeaderboardError(false);
        setLastUpdated(Date.now());
      } catch {
        if (activeRoomRef.current === room.roomCode) {
          setLeaderboardError(true);
        }
      } finally {
        inFlight.current = false;
        setRefreshing(false);
        setLoading(false);
      }
    },
    [room],
  );

  useEffect(() => {
    if (!room) return;

    const initial = window.setTimeout(() => {
      void refresh();
    }, 0);

    const timer = polling
      ? window.setInterval(() => {
          if (document.visibilityState === "visible") {
            void refresh({ silent: true });
          }
        }, POLL_MS)
      : null;

    return () => {
      window.clearTimeout(initial);
      if (timer !== null) window.clearInterval(timer);
    };
  }, [room, refresh, polling]);

  async function handleCreate() {
    setCreating(true);
    setCreateError(false);

    try {
      const created = await createGame();
      setRoom(created);
      setEntries([]);
      setLastUpdated(null);
      setCodeVisible(false);
      setLeaderboardError(false);

      try {
        window.localStorage.setItem(
          HOST_ROOM_KEY,
          JSON.stringify(created),
        );
      } catch {
        // The room still works for this session.
      }
    } catch {
      setCreateError(true);
    } finally {
      setCreating(false);
    }
  }

  function newGame() {
    if (!window.confirm(copy.newGameConfirm)) return;

    setRoom(null);
    setEntries([]);
    setLastUpdated(null);
    setCodeVisible(false);
    setLeaderboardError(false);

    try {
      window.localStorage.removeItem(HOST_ROOM_KEY);
    } catch {
      // No-op.
    }
  }

  async function copyText(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1_600);
    } catch {
      setCopiedKey(null);
    }
  }

  const updatedLabel =
    lastUpdated !== null
      ? new Intl.DateTimeFormat(language, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date(lastUpdated))
      : "";

  if (!hydrated) {
    return (
      <div className="shell py-16">
        <div className="mx-auto h-72 max-w-3xl animate-pulse rounded-[30px] border border-white/60 bg-white/50" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-10 size-[420px] rounded-full bg-[#6366F1]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-20 size-[360px] rounded-full bg-[#7C3AED]/10 blur-3xl" />

      <div className="shell relative py-8 md:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#1E1B4B]/60 shadow-[0_10px_30px_-22px_rgba(30,27,75,.7)] backdrop-blur-md">
              <Radio className="size-3 text-[#7C3AED]" />
              {copy.badge}
            </div>
            <h1 className="mt-4 text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-[#1E1B4B]">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
              {copy.subtitle}
            </p>
          </div>

          {room && (
            <button
              type="button"
              onClick={newGame}
              className={buttonClass({ variant: "outline", size: "md" })}
            >
              <Plus className="size-4" />
              {copy.newGame}
            </button>
          )}
        </div>

        {!room && (
          <div className="mx-auto mt-10 max-w-2xl rounded-[32px] border border-white/60 bg-white/75 p-7 shadow-[0_30px_80px_-45px_rgba(30,27,75,.5),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-xl sm:p-10">
            <div className="flex items-start gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#7C3AED] text-white shadow-lg shadow-indigo-500/25">
                <QrCode className="size-6" />
              </span>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#7C3AED]">
                  {copy.createEyebrow}
                </p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#1E1B4B]">
                  {copy.createTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {copy.createBody}
                </p>
              </div>
            </div>

            {createError && (
              <p className="mt-5 rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
                {copy.createError}
              </p>
            )}

            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={creating}
              className={buttonClass({
                variant: "primary",
                size: "lg",
                className: "mt-7 w-full",
              })}
            >
              {creating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {copy.creating}
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  {copy.create}
                </>
              )}
            </button>
          </div>
        )}

        {room && (
          <div className="mt-8 grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
            <section className="space-y-4">
              <div className="rounded-[28px] border border-white/40 bg-white/75 p-5 shadow-[0_24px_60px_-45px_rgba(30,27,75,.5),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-md sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                      {copy.roomCode}
                    </p>
                    <p className="mt-1 text-[clamp(2.2rem,5vw,3.2rem)] font-extrabold leading-none tracking-[0.14em] text-[#1E1B4B]">
                      {room.roomCode}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(room.roomCode, "room")}
                    className={buttonClass({
                      variant: "outline",
                      size: "sm",
                      className: "shrink-0",
                    })}
                  >
                    {copiedKey === "room" ? (
                      <>
                        <Check className="size-3.5" />
                        {copy.copied}
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        {copy.copy}
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-6 flex flex-col items-center">
                  <div
                    role="img"
                    aria-label={copy.scanTitle}
                    className="rounded-3xl border border-white/70 bg-white p-4 shadow-[0_20px_45px_-30px_rgba(30,27,75,.55)]"
                  >
                    {joinUrl ? (
                      <QRCodeSVG
                        value={joinUrl}
                        size={240}
                        level="M"
                        marginSize={2}
                        bgColor="#ffffff"
                        fgColor="#1E1B4B"
                        className="h-auto w-full max-w-[240px]"
                      />
                    ) : (
                      <div className="size-[220px] animate-pulse rounded-2xl bg-slate-100" />
                    )}
                  </div>
                  <p className="mt-3 text-center text-xs font-extrabold uppercase tracking-[0.14em] text-[#1E1B4B]/70">
                    {copy.scanTitle}
                  </p>
                  <p className="mt-1 text-center text-[10px] text-slate-400">
                    {copy.scanHint}
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-white/70 bg-white/55 p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                    {copy.joinUrl}
                  </p>
                  <p className="mt-1 break-all text-base font-extrabold leading-6 text-[#1E1B4B]/80 sm:text-lg">
                    {joinUrl}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-[10px] leading-4 text-slate-400">
                      {copy.joinUrlHint}
                    </p>
                    <button
                      type="button"
                      onClick={() => copyText(joinUrl, "join")}
                      className={buttonClass({
                        variant: "outline",
                        size: "sm",
                        className: "shrink-0",
                      })}
                    >
                      {copiedKey === "join" ? (
                        <>
                          <Check className="size-3.5" />
                          {copy.copied}
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          {copy.copy}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-amber-200/70 bg-amber-50/80 p-5 shadow-[0_24px_60px_-45px_rgba(120,80,0,.35)] backdrop-blur-md sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-700">
                    <KeyRound className="size-3.5" />
                    {copy.unlockCode}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCodeVisible((visible) => !visible)}
                      aria-pressed={codeVisible}
                      className={buttonClass({
                        variant: "outline",
                        size: "sm",
                        className: "border-amber-300 bg-white/70",
                      })}
                    >
                      {codeVisible ? (
                        <>
                          <EyeOff className="size-3.5" />
                          {copy.hideCode}
                        </>
                      ) : (
                        <>
                          <Eye className="size-3.5" />
                          {copy.showCode}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyText(room.unlockCode, "unlock")}
                      className={buttonClass({
                        variant: "outline",
                        size: "sm",
                        className: "border-amber-300 bg-white/70",
                      })}
                    >
                      {copiedKey === "unlock" ? (
                        <>
                          <Check className="size-3.5" />
                          {copy.copied}
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          {copy.copy}
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-[clamp(2rem,5vw,2.8rem)] font-extrabold leading-none tracking-[0.16em] text-[#3F2A00]">
                  {codeVisible
                    ? room.unlockCode
                    : "•".repeat(room.unlockCode.length)}
                </p>
                <p className="mt-3 text-[11px] leading-5 text-amber-800/70">
                  {copy.revealBody}
                </p>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/40 bg-white/75 p-5 shadow-[0_30px_80px_-45px_rgba(30,27,75,.5),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-md sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="size-4 text-[#7C3AED]" />
                    <h2 className="text-lg font-extrabold tracking-[-0.03em] text-[#1E1B4B]">
                      {copy.leaderboard}
                    </h2>
                  </div>
                  <p className="mt-1 max-w-md text-[11px] leading-4 text-slate-500">
                    {copy.leaderboardBody}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void refresh({ silent: true })}
                  disabled={refreshing}
                  className={buttonClass({
                    variant: "outline",
                    size: "sm",
                    className: "shrink-0",
                  })}
                >
                  <RefreshCw
                    className={cn("size-3.5", refreshing && "animate-spin")}
                  />
                  {refreshing ? copy.refreshing : copy.refresh}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
                    <Users className="size-3" />
                    {t("host.players", { count: entries.length })}
                  </span>
                  {updatedLabel && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">
                      {t("host.updated", { time: updatedLabel })}
                    </span>
                  )}
                </div>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-2 focus-within:ring-2 focus-within:ring-[#7C3AED]/30">
                  <input
                    type="checkbox"
                    checked={polling}
                    onChange={(event) => setPolling(event.target.checked)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                      polling ? "bg-[#7C3AED]" : "bg-slate-300",
                    )}
                  >
                    <span
                      className={cn(
                        "ml-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
                        polling && "translate-x-5",
                      )}
                    />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[10px] font-extrabold text-slate-600">
                      {copy.autoRefresh}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400">
                      {polling ? copy.autoRefreshOn : copy.autoRefreshOff}
                    </span>
                  </span>
                </label>
              </div>

              {leaderboardError && (
                <p className="mt-4 rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
                  {copy.error}
                </p>
              )}

              <div className="mt-5">
                {loading && entries.length === 0 ? (
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/55 px-4 py-16 text-sm font-semibold text-slate-400">
                    <Loader2 className="size-4 animate-spin" />
                    {copy.refreshing}
                  </div>
                ) : entries.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/80 bg-white/45 px-6 py-14 text-center">
                    <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                      <Users className="size-5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      {copy.empty}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-white/70 bg-white/55">
                    <table className="w-full min-w-[640px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-slate-200/70">
                          <th scope="col" className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                            {copy.rank}
                          </th>
                          <th scope="col" className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                            {copy.player}
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                            {copy.initialBudget}
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                            {copy.finalBalance}
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                            {copy.returnLabel}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry, index) => {
                          const pct = returnPercent(entry.finalBalance);

                          return (
                            <tr
                              key={entry.id}
                              className="border-b border-slate-100/80 last:border-b-0"
                            >
                              <td className="px-4 py-3.5">
                                <span
                                  className={cn(
                                    "grid size-8 place-items-center rounded-xl text-xs font-extrabold",
                                    index === 0
                                      ? "bg-gradient-to-br from-[#6366F1] to-[#7C3AED] text-white"
                                      : "bg-slate-100 text-slate-500",
                                  )}
                                >
                                  {index === 0 ? (
                                    <Crown className="size-4" />
                                  ) : (
                                    index + 1
                                  )}
                                </span>
                              </td>
                              <td className="max-w-[280px] truncate px-4 py-4 text-base font-extrabold text-[#1E1B4B]">
                                {entry.playerName}
                              </td>
                              <td className="px-4 py-3.5 text-right text-xs font-semibold tabular-nums text-slate-500">
                                {formatCurrency(STARTING_BUDGET)}
                              </td>
                              <td className="px-4 py-4 text-right text-base font-extrabold tabular-nums text-[#1E1B4B]">
                                {formatCurrency(entry.finalBalance, {
                                  decimals: true,
                                })}
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <span
                                  className={cn(
                                    "inline-flex rounded-full px-2.5 py-1 text-sm font-extrabold tabular-nums",
                                    pct > 0
                                      ? "bg-emerald-50 text-emerald-700"
                                      : pct < 0
                                        ? "bg-rose-50 text-rose-700"
                                        : "bg-slate-100 text-slate-500",
                                  )}
                                >
                                  {formatReturn(pct)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <p className="mt-4 flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3.5 py-2.5 text-[10px] font-semibold text-indigo-700/70">
                <Eye className="size-3.5 shrink-0" />
                {copy.revealHint}
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}


