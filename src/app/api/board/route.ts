import { connection } from "next/server";
import { buildDemoVotes, seedStartups } from "@/lib/pitch-data";
import { getBoard } from "@/lib/server/pitch-store";

export async function GET() {
  await connection();
  const board = await getBoard();

  return Response.json(
    {
      startups: [...seedStartups, ...board.startups],
      votes: board.votes,
      demoVotes: buildDemoVotes(seedStartups),
      persistent: board.persistent,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
