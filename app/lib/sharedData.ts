import path from "path";
import fs from "fs";

function candidatePaths(...segments: string[]) {
  const cwd = process.cwd();
  return [
    path.join(cwd, "shared-data", ...segments), // when running from repo root
    path.join(cwd, "..", "shared-data", ...segments), // when running from admin/
    path.join(__dirname, "..", "..", "shared-data", ...segments), // compiled/.next contexts
  ];
}

export function resolveSharedData(...segments: string[]) {
  const candidates = candidatePaths(...segments);
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
      // if the parent directory exists, prefer this candidate so callers can create the file/dir
      const parent = path.dirname(p);
      if (fs.existsSync(parent)) return p;
    } catch (e) {
      // ignore
    }
  }
  // Fallback to first candidate
  return candidates[0];
}

export default resolveSharedData;
