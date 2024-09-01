import sqlite3 from "sqlite3";
import { promisify } from "util";

const db = new sqlite3.Database('./db.db', (err) => {
  if (err) {
    console.error('Database error:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});


const dbGet = promisify(db.get).bind(db);
const dbAll = promisify(db.all).bind(db);

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID }); 
      }
    });
  });
};

export { db, dbGet, dbRun, dbAll };
