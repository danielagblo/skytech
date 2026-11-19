import { getHomeStatements } from "@/app/lib/home-statements";
import StatementsManager from "./StatementsManager";

export const dynamic = "force-dynamic";

export default async function DashboardHomeStatementsPage() {
  const content = await getHomeStatements();
  const serializable = JSON.parse(JSON.stringify(content));

  return <StatementsManager initialContent={serializable} />;
}
