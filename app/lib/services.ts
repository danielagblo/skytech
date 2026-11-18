import { isMysql } from "./db";
import * as mysql from "./mysql";
import {
  DEFAULT_FILM_SERVICES,
  normalizeFilmServicesContent,
  type FilmServicesContent,
} from "./services-shared";

export type {
  FilmServiceItem,
  FilmServiceStep,
  FilmServicesContent,
  ServiceMedia,
} from "./services-shared";
export { DEFAULT_FILM_SERVICES, normalizeFilmServicesContent } from "./services-shared";

async function getServicesMysql(): Promise<FilmServicesContent> {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT payload FROM film_services WHERE page_key = ? LIMIT 1",
    ["services"],
  );
  if (!rows.length) return DEFAULT_FILM_SERVICES;
  return normalizeFilmServicesContent(mysql.parseJson(rows[0].payload) as FilmServicesContent);
}

async function saveServicesMysql(content: FilmServicesContent): Promise<void> {
  await mysql.initSchema();
  const payload = JSON.stringify(normalizeFilmServicesContent(content));
  const existing = await mysql.query(
    "SELECT id FROM film_services WHERE page_key = ? LIMIT 1",
    ["services"],
  );
  if (existing.length > 0) {
    await mysql.update("film_services", existing[0].id, {
      payload,
      updated_at: new Date(),
    });
    return;
  }
  await mysql.insert("film_services", {
    page_key: "services",
    payload,
    updated_at: new Date(),
  });
}

export async function getFilmServices(): Promise<FilmServicesContent> {
  if (isMysql()) {
    try {
      return await getServicesMysql();
    } catch (error) {
      console.error("Failed to fetch film services:", error);
      return DEFAULT_FILM_SERVICES;
    }
  }
  return DEFAULT_FILM_SERVICES;
}

export async function saveFilmServices(content: FilmServicesContent): Promise<void> {
  if (isMysql()) {
    await saveServicesMysql(content);
    return;
  }
  console.warn("Film services save skipped: MySQL is not configured.");
}
