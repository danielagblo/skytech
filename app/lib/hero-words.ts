import { isMysql } from "./db";
import * as mysql from "./mysql";
import {
  DEFAULT_HERO_WORDS,
  normalizeHeroWordsContent,
  type HeroWordsContent,
} from "./hero-words-shared";

export type { HeroWordsContent } from "./hero-words-shared";
export { DEFAULT_HERO_WORDS, normalizeHeroWordsContent } from "./hero-words-shared";

const PAGE_KEY = "hero-words";

async function getHeroWordsMysql(): Promise<HeroWordsContent> {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT payload FROM hero_words WHERE page_key = ? LIMIT 1",
    [PAGE_KEY],
  );
  if (!rows.length) return DEFAULT_HERO_WORDS;
  return normalizeHeroWordsContent(mysql.parseJson(rows[0].payload) as HeroWordsContent);
}

async function saveHeroWordsMysql(content: HeroWordsContent): Promise<void> {
  await mysql.initSchema();
  const payload = JSON.stringify(normalizeHeroWordsContent(content));
  const existing = await mysql.query(
    "SELECT id FROM hero_words WHERE page_key = ? LIMIT 1",
    [PAGE_KEY],
  );
  if (existing.length > 0) {
    await mysql.update("hero_words", existing[0].id, {
      payload,
      updated_at: new Date(),
    });
    return;
  }
  await mysql.insert("hero_words", {
    page_key: PAGE_KEY,
    payload,
    updated_at: new Date(),
  });
}

export async function getHeroWords(): Promise<HeroWordsContent> {
  if (isMysql()) {
    try {
      return await getHeroWordsMysql();
    } catch (error) {
      console.error("Failed to fetch hero words:", error);
      return DEFAULT_HERO_WORDS;
    }
  }
  return DEFAULT_HERO_WORDS;
}

export async function saveHeroWords(content: HeroWordsContent): Promise<void> {
  if (isMysql()) {
    await saveHeroWordsMysql(content);
    return;
  }
  console.warn("Hero words save skipped: MySQL is not configured.");
}
