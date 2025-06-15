const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('teleDoctor.db');

db.all("SELECT * FROM patients", [], (err, rows) => {
    if (err) {
        throw err;
    }
    fs.writeFileSync('patients.json', JSON.stringify(rows, null, 2));
    console.log("Patients exported successfully");
    db.close();
});