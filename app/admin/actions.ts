"use server";
import { uploadImage, deleteImage } from "../lib/storage";
import { getHeroData, saveHeroData } from "../lib/hero";
import { getPricing, savePricing } from "../lib/pricing";
import { revalidatePath } from "next/cache";

import { getSettings, saveSettings, SiteSettings } from "../lib/settings";
import { saveAffiliates, IAffiliate } from "../lib/affiliates";
import { saveTestimonials, ITestimonial } from "../lib/testimonials";
import { saveTeamMembers, ITeamMember } from "../lib/team";
import { saveFAQs, IFAQ } from "../lib/faqs";


export async function updateHomeHero(formData: FormData) {
  try {
    const imageFile = formData.get("image");
    const currentImageUrl = formData.get("currentImageUrl") as string;
    let imageUrl = currentImageUrl;

    if (imageFile && (imageFile as any).size > 0 && typeof imageFile !== 'string') {
      // Delete old image if it exists
      if (currentImageUrl) {
        await deleteImage(currentImageUrl);
      }
      imageUrl = await uploadImage(imageFile as any);
    }


    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const headline = formData.get("headline") as string;
    const headlineSub = formData.get("headlineSub") as string;
    const subText = formData.get("subText") as string;
    let stats;
    const statsRaw = formData.get("stats") as string;
    if (statsRaw) {
      try {
        stats = JSON.parse(statsRaw);
      } catch {
        stats = undefined;
      }
    }
    let headlines;
    const headlinesRaw = formData.get("headlines") as string;
    if (headlinesRaw) {
      try {
        headlines = JSON.parse(headlinesRaw);
      } catch {
        headlines = undefined;
      }
    }
    const headlineMode =
      formData.get("headlineMode") === "typing" ? "typing" : "slide";

    await saveHeroData({
      title,
      subtitle,
      headline,
      headlineSub,
      subText,
      ...(stats ? { stats } : {}),
      ...(Array.isArray(headlines) ? { headlines } : {}),
      headlineMode,
      imageUrl,
      updatedAt: new Date()
    });

    revalidatePath("/");
    revalidatePath("/landing");
    return { success: true, imageUrl };
  } catch (error: any) {
    console.error("Hero update error:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePricingCategory(category: string, packages: any[]) {
  try {
    const pricing = await getPricing();
    const index = pricing.findIndex(p => p.category === category);
    
    if (index !== -1) {
      pricing[index].packages = packages;
      pricing[index].updatedAt = new Date();
    } else {
      // Add new category if it doesn't exist
      pricing.push({
        category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        packages,
        updatedAt: new Date()
      });
    }

    await savePricing(pricing);

    revalidatePath("/pricing");
    revalidatePath("/");
    
    return { success: true };
  } catch (error: any) {
    console.error("Pricing update error:", error);
    return { success: false, error: error.message };
  }
}

export async function uploadPartnerLogoAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file || file.size === 0) throw new Error("No file provided");
    
    const imageUrl = await uploadImage(file, "partners");
    return { success: true, imageUrl };
  } catch (error: any) {
    console.error("Partner logo upload error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateSettingsAction(settings: Partial<SiteSettings>) {
  try {
    await saveSettings(settings);
    revalidatePath("/");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Settings update error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateAffiliatesAction(affiliates: IAffiliate[]) {
  try {
    await saveAffiliates(affiliates);
    revalidatePath("/");
    revalidatePath("/dashboard/affiliates");
    return { success: true };
  } catch (error: any) {
    console.error("Affiliates update error:", error);
    return { success: false, error: error.message };
  }
}
export async function updateTestimonialsAction(testimonials: ITestimonial[]) {
  try {
    await saveTestimonials(testimonials);
    revalidatePath("/");
    revalidatePath("/dashboard/testimonials");
    return { success: true };
  } catch (error: any) {
    console.error("Testimonials update error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTeamAction(members: ITeamMember[]) {
  try {
    await saveTeamMembers(members);
    revalidatePath("/about");
    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (error: any) {
    console.error("Team update error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateFAQsAction(faqs: IFAQ[]) {
  try {
    const result = await saveFAQs(faqs);
    revalidatePath("/");
    revalidatePath("/faqs");
    revalidatePath("/dashboard/faqs");
    return { success: true, faqs: result.faqs };
  } catch (error: any) {
    console.error("FAQs update error:", error);
    return { success: false, error: error.message };
  }
}

