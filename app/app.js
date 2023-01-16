const db = require('./db');
const express = require('express')
const path = require('path');
const app = express()
const port = 8080

var dbPool = db.connect();

app.get('/dbtest', (req, res) => {
    var result = dbPool.query('SELECT * from Categories', (err, rows) => {
        res.json(rows);
    });
});

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
