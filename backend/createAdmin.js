const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('teleDoctor.db');

const username = 'ministryAdmin';
const password = 'admin123';
const role = 'admin';

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing password', err);
        return;
    }

    db.run(`INSERT INTO users (username, password, role, approved) VALUES (?, ?, ?, 1)`,
        [username, hash, role],
        function (err) {
            if (err) {
                console.error('Admin already exists or error inserting', err);
            } else {
                console.log('Admin user created');
            }
            db.close();
        });
});