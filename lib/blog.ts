// Blog data layer. Swap `dummyPosts` for a real fetch (Sanity or the custom
// admin dashboard API) inside the functions below without touching callers -
// every function already returns a Promise so the transition is a no-op for
// consumers.
//
// To wire up Sanity: replace the bodies with `client.fetch(...)` calls
// against your GROQ queries, mapping the response into `BlogPost`.
// To wire up a custom API: replace the bodies with `fetch(process.env.NEXT_PUBLIC_BLOG_API_URL + ...)`.

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string[]
  coverImage: string
  publishedAt: string
  readTimeMinutes: number
  author?: string
}

const dummyPosts: BlogPost[] = [
  {
    slug: "how-to-enjoy-free-data-in-2026",
    title: "How to Enjoy Free Data in 2026 to Make Best of It",
    excerpt:
      "We wake up, check our phones, stream music, complete banking transactions, and collaborate with colleagues thousands of miles away—all before...",
    content: [
      "We wake up, check our phones, stream music, complete banking transactions, and collaborate with colleagues thousands of miles away—all before our first cup of coffee. The catalyst behind this seamless reality is the Internet, an invisible, sprawling web of data that has transformed from a niche military research project...",
      "Providers across Ghana are increasingly bundling free data promotions into everyday services, from mobile banking apps to social platforms. Knowing which windows to use and which apps to whitelist can save households a meaningful chunk of their monthly budget.",
      "The trick isn't just chasing every promo - it's building a routine around the ones that consistently deliver, and pairing them with basic data-saving habits like compressed browsing and offline caching.",
    ],
    coverImage: "/blog/free-data-2026.png",
    publishedAt: "2026-06-03",
    readTimeMinutes: 5,
    author: "Skytech Ghana",
  },
  {
    slug: "remote-work-security-checklist",
    title: "The Remote Work Security Checklist Every Business Needs",
    excerpt:
      "Hybrid teams open new doors for attackers. Here's the shortlist of controls we roll out for every client before they let staff work from home...",
    content: [
      "Hybrid teams open new doors for attackers. Here's the shortlist of controls we roll out for every client before they let staff work from home.",
      "Start with device hygiene: enforced disk encryption, managed updates, and a VPN that actually gets used. Then layer on access control - least privilege by default, MFA everywhere, and short-lived credentials for anything sensitive.",
      "Finally, don't skip the boring part: a written incident response plan that non-technical staff can actually follow when something looks wrong.",
    ],
    coverImage: "/blog/remote-work-security.png",
    publishedAt: "2026-05-21",
    readTimeMinutes: 6,
    author: "Skytech Ghana",
  },
  {
    slug: "why-choose-skytech-ghana",
    title: "Why Choose Skytech Ghana for Your Next Project",
    excerpt:
      "Nearly a decade of hands-on experience in digital business development and enterprise security means we've already made the mistakes so you don't have to...",
    content: [
      "Nearly a decade of hands-on experience in digital business development and enterprise security means we've already made the mistakes so you don't have to.",
      "Our teams pair fast delivery with long-term maintenance thinking, so the site or system we hand over keeps working long after launch day.",
      "That's the difference between a vendor and a partner - and it's why most of our clients come back for the next project.",
    ],
    coverImage: "/blog/why-choose-skytech.png",
    publishedAt: "2026-05-10",
    readTimeMinutes: 4,
    author: "Skytech Ghana",
  },
  {
    slug: "ecommerce-trends-ghana-2026",
    title: "5 Ecommerce Trends Shaping Ghanaian Retail in 2026",
    excerpt:
      "Mobile money checkout, WhatsApp storefronts, and same-day delivery are no longer nice-to-haves - they're what customers expect by default...",
    content: [
      "Mobile money checkout, WhatsApp storefronts, and same-day delivery are no longer nice-to-haves - they're what customers expect by default.",
      "We're seeing the sharpest growth among merchants who treat WhatsApp as a full sales channel rather than just a support line, backed by a lightweight catalog and fast checkout flow.",
      "The businesses winning this year are the ones investing in the boring infrastructure - inventory sync, order tracking, reliable hosting - rather than just the storefront.",
    ],
    coverImage: "/blog/ecommerce-trends.png",
    publishedAt: "2026-04-18",
    readTimeMinutes: 5,
    author: "Skytech Ghana",
  },
  {
    slug: "cyber-threats-to-watch-2026",
    title: "Cyber Threats Ghanaian Businesses Should Watch in 2026",
    excerpt:
      "Phishing has gotten more convincing, and SMEs are now squarely in the crosshairs rather than an afterthought. Here's what we're seeing on the ground...",
    content: [
      "Phishing has gotten more convincing, and SMEs are now squarely in the crosshairs rather than an afterthought. Here's what we're seeing on the ground.",
      "Business email compromise remains the single costliest threat category for the companies we work with, largely because it targets people, not just systems.",
      "Regular staff training paired with basic technical controls - SPF/DKIM/DMARC, MFA, and endpoint monitoring - closes most of the gap at a fraction of the cost of a breach.",
    ],
    coverImage: "/blog/cyber-threats-2026.png",
    publishedAt: "2026-03-29",
    readTimeMinutes: 7,
    author: "Skytech Ghana",
  },
]

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return [...dummyPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export async function getLatestBlogPosts(limit: number): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts()
  return posts.slice(0, limit)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getAllBlogPosts()
  return posts.find((post) => post.slug === slug)
}

export async function getRelatedBlogPosts(slug: string, limit: number): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts()
  return posts.filter((post) => post.slug !== slug).slice(0, limit)
}

export function formatBlogDate(isoDate: string): string {
  const date = new Date(isoDate)
  const day = date.getUTCDate()
  const month = date.toLocaleString("en-US", { month: "long", timeZone: "UTC" })
  const year = date.getUTCFullYear()
  return `${day}${ordinalSuffix(day)}/${month}/${year}`
}

function ordinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th"
  switch (day % 10) {
    case 1: return "st"
    case 2: return "nd"
    case 3: return "rd"
    default: return "th"
  }
}
