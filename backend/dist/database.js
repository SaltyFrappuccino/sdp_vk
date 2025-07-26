import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
let db;
// Включаем подробный режим для отладки
const verboseSqlite3 = sqlite3.verbose();
// Функция для инициализации и подключения к БД
export async function initializeDatabase() {
    db = await open({
        filename: 'anketi.db', // Путь относительно dist/index.js
        driver: verboseSqlite3.Database
    });
    console.log('Connected to the SQLite database.');
    // SQL для создания таблицы Characters
    const createCharactersTable = `
    CREATE TABLE IF NOT EXISTS Characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vk_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'на рассмотрении',
      character_name TEXT NOT NULL,
      nickname TEXT,
      age INTEGER,
      rank TEXT DEFAULT 'F',
      faction TEXT,
      home_island TEXT,
      appearance TEXT,
      personality TEXT,
      biography TEXT,
      archetypes TEXT,
      attributes TEXT, -- JSON
      inventory TEXT, -- JSON
      currency INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
    // SQL для создания таблицы Contracts
    const createContractsTable = `
    CREATE TABLE IF NOT EXISTS Contracts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL,
      contract_name TEXT NOT NULL,
      creature_name TEXT,
      creature_rank TEXT,
      creature_spectrum TEXT,
      creature_description TEXT,
      gift TEXT,
      sync_level INTEGER DEFAULT 0,
      unity_stage TEXT DEFAULT 'Ступень I - Активация',
      abilities TEXT, -- JSON
      FOREIGN KEY (character_id) REFERENCES Characters (id) ON DELETE CASCADE
    );
  `;
    await db.exec(createCharactersTable);
    console.log('Table "Characters" is ready.');
    await db.exec(createContractsTable);
    console.log('Table "Contracts" is ready.');
    // Триггер для автоматического обновления updated_at в Characters
    const createUpdateTrigger = `
    CREATE TRIGGER IF NOT EXISTS update_character_updated_at
    AFTER UPDATE ON Characters
    FOR EACH ROW
    BEGIN
      UPDATE Characters SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
  `;
    await db.exec(createUpdateTrigger);
    console.log('Update trigger for "Characters" is ready.');
}
export function getDb() {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase first.');
    }
    return db;
}
