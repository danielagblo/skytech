import { getFilmServices } from "@/app/lib/services";
import ServicesManager from "./ServicesManager";

export const dynamic = "force-dynamic";

export default async function DashboardServicesPage() {
  const content = await getFilmServices();
  const serializable = JSON.parse(JSON.stringify(content));

  return <ServicesManager initialContent={serializable} />;
}
