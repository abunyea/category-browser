var bodyParser = require('body-parser');
const express = require('express')
const path = require('path');

const db = require('./db');

const app = express()
const port = 8081

var dbPool = db.connect();


app.use(bodyParser.json());

// search
app.get('/api/categories/search', (req, res) => {
  const query = req.query['q'];
  db.search(dbPool, query, (err, rows) => {
    if (err) {
      logSqlError(res, err);
      return;
    }
    res.json(rows);
  });
});

// list
app.get('/api/categories', (_req, res) => {
  db.listCategories(dbPool, (err, rows) => {
    if (err) {
      logSqlError(res, err);
      return;
    }
    res.json(rows);
  });
});

// create
app.post('/api/categories', (req, res) => {
  if (!req.body.displayName) {
    res.status(400).json({
      error: 'displayName is required'
    });
    return;
  }

  db.createCategory(
    dbPool, 
    req.body.displayName, 
    req.body.alternateNames || null, 
    req.body.description || null,
    req.body.parentIds || [],
    (err, result) => {
      if (err) {
        logSqlError(res, err);
        return;
      }
      res.json({ conceptId: result.conceptId });
  });
});

app.get('/api/categories/:conceptId', (req, res) => {
  const conceptId = req.params['conceptId'];
  db.getCategory(dbPool, conceptId, (err, category) => {
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

app.put('/api/categories/:conceptId', (req, res) => {
  const conceptId = req.params['conceptId'];

  if (!req.body.displayName) {
    res.status(400).json({
      error: 'displayName is required'
    });
    return;
  }

  db.updateCategory(
    dbPool, 
    conceptId,
    req.body.displayName, 
    req.body.alternateNames || null, 
    req.body.description || null,
    req.body.parentIds || [],
    (err) => {
      if (err) {
        logSqlError(res, err);
        return;
      }
      res.sendStatus(204);
  });
});

app.delete('/api/categories/:conceptId', (req, res) => {
  const conceptId = req.params['conceptId'];
  db.deleteCategory(dbPool, conceptId, (err) => {
    if (err) {
      logSqlError(res, err);
      return;
    }
    res.sendStatus(204);
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
