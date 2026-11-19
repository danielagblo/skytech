import { getHeroWords } from "@/app/lib/hero-words";
import HeroWordsManager from "./HeroWordsManager";

export const dynamic = "force-dynamic";

export default async function DashboardHeroWordsPage() {
  const content = await getHeroWords();
  const serializable = JSON.parse(JSON.stringify(content));
  return <HeroWordsManager initialContent={serializable} />;
}
