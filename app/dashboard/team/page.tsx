import React from "react";
import TeamManager from "./TeamManager";
import { getTeamMembers } from "../../lib/team";

export const dynamic = 'force-dynamic';

export default async function TeamDashboardPage() {
  const members = await getTeamMembers();

  return (
    <div className="space-y-8">
      <TeamManager initialMembers={members} />
    </div>
  );
}
