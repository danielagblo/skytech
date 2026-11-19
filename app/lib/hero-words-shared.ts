export interface HeroWordsContent {
  words: string[];
}

export const DEFAULT_HERO_WORDS: HeroWordsContent = {
  words: ["Better", "Massive"],
};

export function normalizeHeroWordsContent(
  input?: Partial<HeroWordsContent> | string[] | null,
): HeroWordsContent {
  const raw = Array.isArray(input)
    ? input
    : Array.isArray(input?.words)
      ? input.words
      : [];
  const words = raw
    .map((word) => String(word || "").trim())
    .filter(Boolean)
    .slice(0, 24);
  return {
    words: words.length ? words : [...DEFAULT_HERO_WORDS.words],
  };
}
