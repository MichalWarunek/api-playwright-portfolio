import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let dbInstance: Database | null = null;

export const db = {
  init: async () => {
    if (!dbInstance) {
      dbInstance = await open({
        filename: './test_database.db', 
        driver: sqlite3.Database
      });
      

      await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS bookings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          firstname TEXT,
          lastname TEXT,
          totalprice INTEGER,
          depositpaid BOOLEAN,
          checkin TEXT,
          checkout TEXT,
          additionalneeds TEXT
        )
      `);
    }
    return dbInstance;
  },

  run: async (sql: string, params: any[] = []) => {
    if (!dbInstance) {
      await db.init();
    }
    return await dbInstance!.run(sql, params);
  },
  
  close: async () => {
    if (dbInstance) {
      await dbInstance.close();
      dbInstance = null;
    }
  }
};