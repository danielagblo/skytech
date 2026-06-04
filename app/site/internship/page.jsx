import InternshipClient from './InternshipClient';
import { getPageContent } from '../../lib/pages';

export const metadata = {
  title: "Internship / Attachment - Skytech Ghana",
  description: "Apply for an internship or attachment at Skytech Ghana.",
};

export const dynamic = 'force-dynamic';

export default async function InternshipPage() {
  const pages = await getPageContent();
  const internshipContent = pages.internship || {};
  return (
    <InternshipClient internshipContent={internshipContent} />
  );
}
