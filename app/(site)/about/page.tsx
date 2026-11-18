import FilmAbout from "@/components/skytech/sections/pages/FilmAbout";
import { getTeamMembers } from "@/app/lib/team";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About | Skytech Ghana",
  description: "Skytech Ghana builds websites, apps, and search in Accra, and stays on the work after launch.",
};

export default async function AboutPage() {
  const team = await getTeamMembers();
  const members = (team || [])
    .filter((member) => member?.name)
    .map((member) => ({
      name: member.name,
      role: member.role || "",
      bio: member.bio || "",
      image: member.imageUrl || undefined,
      detail: member.role || "",
    }));

  return <FilmAbout members={members} />;
}
