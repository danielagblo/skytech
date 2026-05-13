import React from "react";
import AboutClient from "./AboutClient";
import { getTeamMembers } from "../../lib/team";

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const teamMembers = await getTeamMembers();
  
  return <AboutClient teamMembers={teamMembers} />;
}
