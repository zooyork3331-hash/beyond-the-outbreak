/* BEYOND THE OUTBREAK — STAFF & SUPPORT SETTINGS
   Edit names, roles, and descriptions between quotation marks.
   Add new staff as separate objects inside the members array.
   OPTIONAL: Replace ticketChannelUrl with the real link to your Discord ticket channel.
   Leave it blank if there is no direct link; the site will use your Discord invite.

   Example new staff member:
   { name: "StaffMember", role: "Moderator", description: "Helps players with reports and questions." },
*/
window.BTO_STAFF = {
  ticketChannelUrl: "",
  members: [
    {
      name: "Respawn",
      role: "Owner / Server Administration",
      description: "Oversees Beyond the Outbreak, server operations, and community direction."
    }
  ]
};
