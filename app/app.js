const express = require('express');
const db = require('./db');
const app = express();
const port = 8080;

var dbPool = db.connect();

app.get('/', (req, res) => {
    var result = dbPool.query('SELECT * from Categories', (err, rows) => {
        res.json(rows);
    });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
