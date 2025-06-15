const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('teleDoctor.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT,
            approved INTEGER DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            age INTEGER,
            diagnosis TEXT,
            doctor TEXT,
            date TEXT
        )
    `);
});

db.close();
console.log("Database initialized.");