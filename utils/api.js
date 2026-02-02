const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api/content";

export const fetchTeam = async () => {
  try {
    const response = await fetch(`${API_BASE}/team`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch team");
    return await response.json();
  } catch (error) {
    console.error("Error fetching team:", error);
    return [];
  }
};

export const fetchServices = async () => {
  try {
    const response = await fetch(`${API_BASE}/services`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch services");
    return await response.json();
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export const fetchTestimonials = async () => {
  try {
    const response = await fetch(`${API_BASE}/testimonials`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch testimonials");
    return await response.json();
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
};

export const fetchSettings = async () => {
  try {
    const response = await fetch(`${API_BASE}/settings`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch settings");
    return await response.json();
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {
      siteName: "SkyTech",
      siteDescription: "Premium software development solutions",
      contactEmail: "hello@skytech.com",
      contactPhone: "+1 (555) 123-4567",
      whatsapp: "+233 20 123 4567",
      address: "Tech Hub, San Francisco, CA 94105, USA",
    };
  }
};
