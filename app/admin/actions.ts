"use server";
import { processAndUpload, deleteFromS3 } from "../lib/s3";
import { getHeroData, saveHeroData } from "../lib/hero";
import { getPricing, savePricing } from "../lib/pricing";
import { revalidatePath } from "next/cache";

import { getSettings, saveSettings, SiteSettings } from "../lib/settings";
import { saveAffiliates, IAffiliate } from "../lib/affiliates";
import { saveTestimonials, ITestimonial } from "../lib/testimonials";

export async function updateHomeHero(formData: FormData) {
  try {
    const imageFile = formData.get("image");
    const currentImageUrl = formData.get("currentImageUrl") as string;
    let imageUrl = currentImageUrl;

    if (imageFile && (imageFile as any).size > 0 && typeof imageFile !== 'string') {
      // Delete old image if it exists
      if (currentImageUrl) {
        await deleteFromS3(currentImageUrl);
      }
      imageUrl = await processAndUpload(imageFile as any);
    }


    await saveHeroData({ 
      imageUrl, 
      updatedAt: new Date() 
    });

    revalidatePath("/");
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

    // Force Next.js to re-render the pricing page with new data
    revalidatePath("/site/pricing");
    
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
    
    const imageUrl = await processAndUpload(file, "partners");
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
