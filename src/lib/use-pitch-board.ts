"use client";

import { useEffect, useRef, useState } from "react";
import {
  buildDemoVotes,
  draftToCard,
  seedStartups,
} from "@/lib/pitch-data";
import type {
  BoardData,
  PitchCard,
  StartupDraft,
  Vote,
  VoteDecision,
} from "@/lib/pitch-types";
import type { DraftErrors } from "@/lib/pitch-validation";
import { uid } from "@/lib/utils";

const VOTER_KEY = "ventureu.voter.v1";
const SUBMISSIONS_KEY = "ventureu.pitch.submissions.v1";
const VOTES_KEY = "ventureu.pitch.votes.v1";

type BoardStatus = "syncing" | "ready" | "offline";

type LocalBoard = {
  submissions: PitchCard[];
  votes: Vote[];
};

type SubmitResult =
  | { ok: true; startup: PitchCard; offline: boolean }
  | { ok: false; error: string; errors?: DraftErrors };

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private mode; the in-memory board still works.
  }
}

function readLocalBoard(): LocalBoard {
  const submissions = readJson<unknown>(SUBMISSIONS_KEY, []);
  const votes = readJson<unknown>(VOTES_KEY, []);
  return {
    submissions: Array.isArray(submissions)
      ? (submissions as PitchCard[])
      : [],
    votes: Array.isArray(votes) ? (votes as Vote[]) : [],
  };
}

function getOrCreateVoterId() {
  if (typeof window === "undefined") return uid("voter");
  try {
    const existing = window.localStorage.getItem(VOTER_KEY);
    if (existing && /^[A-Za-z0-9_-]{6,80}$/.test(existing)) return existing;
    const next = uid("voter");
    window.localStorage.setItem(VOTER_KEY, next);
    return next;
  } catch {
    return uid("voter");
  }
}

function mergeStartups(server: PitchCard[], local: PitchCard[]) {
  const seen = new Set(server.map((startup) => startup.id));
  return [...server, ...local.filter((startup) => !seen.has(startup.id))];
}

export function usePitchBoard() {
  const [voterId, setVoterId] = useState<string | null>(null);
  const [startups, setStartups] = useState<PitchCard[]>(seedStartups);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [demoVotes, setDemoVotes] = useState<Vote[]>([]);
  const [status, setStatus] = useState<BoardStatus>("syncing");
  const [persistent, setPersistent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const votesRef = useRef<Vote[]>([]);
  const voterRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const id = getOrCreateVoterId();
    voterRef.current = id;
    const voterTimer = window.setTimeout(() => {
      if (!cancelled) setVoterId(id);
    }, 0);

    const local = readLocalBoard();

    async function load() {
      try {
        const response = await fetch("/api/board", { cache: "no-store" });
        if (!response.ok) throw new Error("Board request failed.");
        const data = (await response.json()) as BoardData;

        if (!Array.isArray(data.startups) || !Array.isArray(data.votes)) {
          throw new Error("Board response was malformed.");
        }

        if (cancelled) return;
        setStartups(mergeStartups(data.startups, local.submissions));
        setVotes(data.votes);
        votesRef.current = data.votes;
        setDemoVotes(
          Array.isArray(data.demoVotes)
            ? data.demoVotes
            : buildDemoVotes(seedStartups),
        );
        setPersistent(Boolean(data.persistent));
        setStatus("ready");
      } catch {
        if (cancelled) return;
        setStartups(mergeStartups(seedStartups, local.submissions));
        setVotes(local.votes);
        votesRef.current = local.votes;
        setDemoVotes(buildDemoVotes(seedStartups));
        setPersistent(false);
        setStatus("offline");
      }
    }

    void load();

    return () => {
      cancelled = true;
      window.clearTimeout(voterTimer);
    };
  }, []);

  function commitVotes(updater: (current: Vote[]) => Vote[]) {
    const next = updater(votesRef.current);
    votesRef.current = next;
    setVotes(next);
    writeJson(
      VOTES_KEY,
      next.filter((vote) => vote.voterId === voterRef.current),
    );
  }

  async function submitStartup(draft: StartupDraft): Promise<SubmitResult> {
    setError(null);
    const id = voterRef.current;

    if (!id) {
      return { ok: false, error: "The board is still loading. Try again." };
    }

    try {
      const response = await fetch("/api/startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, creatorId: id }),
      });
      const data = (await response.json()) as {
        startup?: PitchCard;
        error?: string;
        errors?: DraftErrors;
        persistent?: boolean;
      };

      if (!response.ok) {
        if (response.status === 400 && data.errors) {
          return {
            ok: false,
            error: data.error ?? "Please fix the highlighted fields.",
            errors: data.errors,
          };
        }
        throw new Error(data.error ?? "Could not publish the startup.");
      }

      if (!data.startup) {
        throw new Error("The server did not return the published startup.");
      }

      setStartups((current) => mergeStartups(current, [data.startup!]));
      setPersistent(Boolean(data.persistent));
      const local = readLocalBoard();
      writeJson(SUBMISSIONS_KEY, [
        ...local.submissions.filter(
          (startup) => startup.id !== data.startup!.id,
        ),
        data.startup,
      ]);

      return { ok: true, startup: data.startup, offline: false };
    } catch {
      const startup = draftToCard(draft, uid("pitch"), id);
      setStartups((current) => mergeStartups(current, [startup]));
      const local = readLocalBoard();
      writeJson(SUBMISSIONS_KEY, [
        ...local.submissions.filter((entry) => entry.id !== startup.id),
        startup,
      ]);
      setStatus("offline");
      setPersistent(false);
      return { ok: true, startup, offline: true };
    }
  }

  function castVote(startupId: string, decision: VoteDecision) {
    const id = voterRef.current;
    if (!id) return;

    const vote: Vote = {
      startupId,
      decision,
      voterId: id,
      createdAt: new Date().toISOString(),
    };

    commitVotes((current) => [
      ...current.filter(
        (entry) =>
          !(entry.voterId === id && entry.startupId === startupId),
      ),
      vote,
    ]);

    void fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startupId, decision, voterId: id }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Vote not saved.");
        setStatus((current) => (current === "offline" ? current : "ready"));
      })
      .catch(() => {
        setStatus("offline");
      });
  }

  function removeVote(startupId: string) {
    const id = voterRef.current;
    if (!id) return;

    commitVotes((current) =>
      current.filter(
        (entry) =>
          !(entry.voterId === id && entry.startupId === startupId),
      ),
    );

    void fetch(
      `/api/votes?voterId=${encodeURIComponent(id)}&startupId=${encodeURIComponent(startupId)}`,
      { method: "DELETE" },
    ).catch(() => setStatus("offline"));
  }

  function resetVotes() {
    const id = voterRef.current;
    if (!id) return;

    commitVotes((current) =>
      current.filter((entry) => entry.voterId !== id),
    );

    void fetch(`/api/votes?voterId=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch(() => setStatus("offline"));
  }

  const myVotes = voterId
    ? votes.filter((vote) => vote.voterId === voterId)
    : [];

  return {
    voterId,
    startups,
    votes,
    demoVotes,
    allVotes: [...demoVotes, ...votes],
    myVotes,
    status,
    persistent,
    error,
    clearError: () => setError(null),
    submitStartup,
    castVote,
    removeVote,
    resetVotes,
  };
}
