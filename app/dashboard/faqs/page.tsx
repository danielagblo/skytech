import FAQManager from "@/app/dashboard/faqs/FAQManager";
import { getAllFAQs } from "../../lib/faqs";

export const dynamic = 'force-dynamic';

export default async function FAQDashboardPage() {
  const faqs = await getAllFAQs();

  return (
    <div className="space-y-8">
      <FAQManager initialFAQs={faqs} />
    </div>
  );
}
