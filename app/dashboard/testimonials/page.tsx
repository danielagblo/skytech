import { getTestimonials } from "../../lib/testimonials";
import TestimonialManager from "./TestimonialManager";

export const dynamic = 'force-dynamic';

export default async function TestimonialsDashboardPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="max-w-7xl mx-auto">
      <TestimonialManager initialTestimonials={testimonials} />
    </div>
  );
}
