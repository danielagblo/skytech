import FilmContact from "@/components/skytech/sections/pages/FilmContact";
import { getSettings } from "@/app/lib/settings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact | Skytech Ghana",
  description: "Talk to Skytech Ghana about a website, an app, or care after launch.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <FilmContact
      contactEmail={settings.contactEmail}
      contactPhone={settings.contactPhone}
      whatsapp={settings.whatsapp}
      siteName={settings.siteName}
    />
  );
}
