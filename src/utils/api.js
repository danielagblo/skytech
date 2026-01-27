const API_BASE = import.meta.env.PROD 
  ? 'http://localhost:3000/api/content'
  : 'http://localhost:3000/api/content';

export const fetchTeam = async () => {
  try {
    const response = await fetch(`${API_BASE}/team`);
    if (!response.ok) throw new Error('Failed to fetch team');
    return await response.json();
  } catch (error) {
    console.error('Error fetching team:', error);
    return [];
  }
};

export const fetchServices = async () => {
  try {
    const response = await fetch(`${API_BASE}/services`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return await response.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const fetchTestimonials = async () => {
  try {
    const response = await fetch(`${API_BASE}/testimonials`);
    if (!response.ok) throw new Error('Failed to fetch testimonials');
    return await response.json();
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

export const fetchSettings = async () => {
  try {
    const response = await fetch(`${API_BASE}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      siteName: 'SkyTech',
      siteDescription: 'Premium software development solutions',
      contactEmail: 'hello@skytech.com',
      contactPhone: '+1 (555) 123-4567',
      whatsapp: '+233 20 123 4567',
      address: 'Tech Hub, San Francisco, CA 94105, USA',
    };
  }
};
