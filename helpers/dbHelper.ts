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
      

      await dbInstance.exec(`PRAGMA foreign_keys = ON;`);

      await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS bookings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          firstname TEXT NOT NULL,
          lastname TEXT NOT NULL,
          totalprice INTEGER NOT NULL,
          depositpaid BOOLEAN NOT NULL,
          checkin TEXT NOT NULL,
          checkout TEXT NOT NULL,
          additionalneeds TEXT
        )
      `);
      await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bookingid INTEGER NOT NULL,
          amount INTEGER NOT NULL,
          paymentmethod TEXT NOT NULL,
          status TEXT NOT NULL,
          createdat TEXT NOT NULL,
          FOREIGN KEY (bookingid) REFERENCES bookings(id) ON DELETE CASCADE
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

  get: async (sql: string, params: any[] = []) => {
    if (!dbInstance) {
      await db.init();
    }
    return await dbInstance!.get(sql, params);
  },
  all: async (sql: string, params: any[] = []) => {
    if (!dbInstance) {
      await db.init();
    }
    return await dbInstance!.all(sql, params);
  },
  
  close: async () => {
    if (dbInstance) {
      await dbInstance.close();
      dbInstance = null;
    }
  }
};