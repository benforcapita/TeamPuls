import fs from 'fs/promises';
import path from 'path';

const CACHE_FILE = path.resolve(process.cwd(), '.jira_cache.json');
const TTL = 5 * 60 * 1000; // 5 Minutes

export const cache = {
  async get() {
    try {
      const raw = await fs.readFile(CACHE_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Date.now() - data.timestamp > TTL) return null; // Expired
      return data.issues;
    } catch {
      return null;
    }
  },
  async set(issues: any[]) {
    await fs.writeFile(
      CACHE_FILE,
      JSON.stringify({ timestamp: Date.now(), issues })
    );
  },
};
