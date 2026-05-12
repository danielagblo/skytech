import { getHeroData } from "../../lib/hero";
import HeroForm from "./HeroForm";

export const dynamic = "force-dynamic";

export default async function DashboardHeroPage() {
  const heroData = await getHeroData();
  
  // Transform to plain object
  const serializableHero = JSON.parse(JSON.stringify(heroData));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Home Hero Manager</h1>
        <p className="text-slate-500 mt-2">Manage your flagship headlines and the primary visual asset via S3.</p>
      </div>
      
      <HeroForm initialData={serializableHero} />
    </div>
  );
}
