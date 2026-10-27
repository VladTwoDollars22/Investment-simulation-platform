import { seedStartups } from "@/lib/pitch-data";
import type { VoteDecision } from "@/lib/pitch-types";
import { castVote, getBoard, removeVotes } from "@/lib/server/pitch-store";

function validActorId(value: unknown): value is string {
  return (
    typeof value === "string" && /^[A-Za-z0-9_-]{6,80}$/.test(value)
  );
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const startupId =
    typeof body.startupId === "string" ? body.startupId : "";
  const decision = body.decision;
  const voterId = body.voterId;

  if (!validActorId(voterId)) {
    return Response.json({ error: "Invalid voter ID." }, { status: 400 });
  }

  if (decision !== "invest" && decision !== "pass") {
    return Response.json({ error: "Invalid vote." }, { status: 400 });
  }

  const board = await getBoard();
  const exists =
    seedStartups.some((startup) => startup.id === startupId) ||
    board.startups.some((startup) => startup.id === startupId);

  if (!exists) {
    return Response.json({ error: "Startup not found." }, { status: 404 });
  }

  try {
    const result = await castVote({
      startupId,
      decision: decision as VoteDecision,
      voterId,
      createdAt: new Date().toISOString(),
    });
    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Could not record vote.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const voterId = url.searchParams.get("voterId");
  const startupId = url.searchParams.get("startupId") ?? undefined;

  if (!validActorId(voterId)) {
    return Response.json({ error: "Invalid voter ID." }, { status: 400 });
  }

  try {
    const result = await removeVotes(voterId, startupId);
    return Response.json(result);
  } catch {
    return Response.json(
      { error: "Could not clear votes." },
      { status: 400 },
    );
  }
}
