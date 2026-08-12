export type DbType = "mongodb" | "mysql";

export function getDbType(): DbType {
  const raw = (process.env.DB_TYPE || "mongodb").toLowerCase();
  return raw === "mysql" ? "mysql" : "mongodb";
}

export function isMysql(): boolean {
  return getDbType() === "mysql";
}

export function isMongo(): boolean {
  return getDbType() === "mongodb";
}