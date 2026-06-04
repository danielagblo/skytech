import ContactClient from './ContactClient';
import { getSettings } from '../../lib/settings';
import { getPageContent } from '../../lib/pages';
import { getTeamMembers } from '../../lib/team';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact Skytech Ghana - Get In Touch',
  description: 'Contact Skytech Ghana for software development inquiries. Get in touch with our team today.',
};

export default async function Contact() {
  const settings = await getSettings();
  const teamMembers = await getTeamMembers();
  const pages = await getPageContent();
  const contactContent = pages.contact || {};

  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Skytech Ghana',
    url: 'https://skytechghana.com',
    telephone: settings.contactPhone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <ContactClient
        settings={settings}
        teamMembers={teamMembers}
        contactContent={contactContent}
      />
    </>
  );
}
