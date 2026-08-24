import { getAffiliates } from "../../lib/affiliates";
import FormsPageContent from "../../../components/skytech/sections/landing/FormsPageContent";

export const dynamic = "force-dynamic";

export default async function FormsPage() {
  const partnersData = await getAffiliates();
  const allPartners = (partnersData || []).filter((p) => p?.logoUrl || p?.name);

  return <FormsPageContent partners={allPartners} />;
}
