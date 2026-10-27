import { randomUUID } from "node:crypto";
import { accentForNiche } from "@/lib/pitch-types";
import { sanitizeDraft } from "@/lib/pitch-validation";
import { addStartup } from "@/lib/server/pitch-store";

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
  const { draft, errors } = sanitizeDraft(body);

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { error: "Please fix the highlighted fields.", errors },
      { status: 400 },
    );
  }

  if (!validActorId(body.creatorId)) {
    return Response.json(
      { error: "A valid creator ID is required." },
      { status: 400 },
    );
  }

  const startup = {
    ...draft,
    id: `pitch-${randomUUID()}`,
    creatorId: body.creatorId,
    accent: accentForNiche(draft.niche),
    createdAt: new Date().toISOString(),
  };

  try {
    const result = await addStartup(startup);
    return Response.json(result, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not add the startup.",
      },
      { status: 400 },
    );
  }
}
