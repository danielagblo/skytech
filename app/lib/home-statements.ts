import { isMysql } from "./db";
import * as mysql from "./mysql";
import {
  DEFAULT_HOME_STATEMENTS,
  normalizeHomeStatementsContent,
  type HomeStatementsContent,
} from "./home-statements-shared";

export type { HomeStatement, HomeStatementsContent } from "./home-statements-shared";
export { DEFAULT_HOME_STATEMENTS, normalizeHomeStatementsContent } from "./home-statements-shared";

const PAGE_KEY = "home-statements";

async function getStatementsMysql(): Promise<HomeStatementsContent> {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT payload FROM home_statements WHERE page_key = ? LIMIT 1",
    [PAGE_KEY],
  );
  if (!rows.length) return DEFAULT_HOME_STATEMENTS;
  return normalizeHomeStatementsContent(mysql.parseJson(rows[0].payload) as HomeStatementsContent);
}

async function saveStatementsMysql(content: HomeStatementsContent): Promise<void> {
  await mysql.initSchema();
  const payload = JSON.stringify(normalizeHomeStatementsContent(content));
  const existing = await mysql.query(
    "SELECT id FROM home_statements WHERE page_key = ? LIMIT 1",
    [PAGE_KEY],
  );
  if (existing.length > 0) {
    await mysql.update("home_statements", existing[0].id, {
      payload,
      updated_at: new Date(),
    });
    return;
  }
  await mysql.insert("home_statements", {
    page_key: PAGE_KEY,
    payload,
    updated_at: new Date(),
  });
}

export async function getHomeStatements(): Promise<HomeStatementsContent> {
  if (isMysql()) {
    try {
      return await getStatementsMysql();
    } catch (error) {
      console.error("Failed to fetch home statements:", error);
      return DEFAULT_HOME_STATEMENTS;
    }
  }
  return DEFAULT_HOME_STATEMENTS;
}

export async function saveHomeStatements(content: HomeStatementsContent): Promise<void> {
  if (isMysql()) {
    await saveStatementsMysql(content);
    return;
  }
  console.warn("Home statements save skipped: MySQL is not configured.");
}
