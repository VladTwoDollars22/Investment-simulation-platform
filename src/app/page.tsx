import { HomeContent } from "@/components/home-content";
import { getHomeStartups } from "@/lib/startups";

export default function Home() {
  return <HomeContent startups={getHomeStartups()} />;
}
