const db = require('./db');
const express = require('express')
const path = require('path');
const app = express()
const port = 8080

var dbPool = db.connect();

app.get('/categories', (_req, res) => {
  db.categories(dbPool, (err, rows) => {
    if (err) {
      logSqlError(res, err);
      return;
    }
    res.json(rows);
  });
});

app.get('/categories/:conceptId', (req, res) => {
  const conceptId = req.params['conceptId'];
  db.category(dbPool, conceptId, (err, category) => {
    if (err && err.notFound) {
      res.status(404).json({ 
        'message': err.message
      });
      return;
    }
    if (err) {
      logSqlError(res, err);
      return;
    }
    res.json(category);
  });
});

function logSqlError(res, err) {
  console.error(err);
  res.status(500).json({
    'error': err.message
  });
}

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/*', function (_req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
