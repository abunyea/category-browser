var mysql = require('mysql');

function connect() {
    return mysql.createPool({
        host: 'database-1.cm9zjpr8nzqi.us-east-1.rds.amazonaws.com',
        port: 3306,
        user: 'admin',
        password: 'regeneron',
        database : 'Ontology'
    })
}

function categories(pool, callback) {
    const query = 'SELECT * FROM Categories';
    pool.query(query, callback);
}

function search(pool, query, callback) {
    const selectMatch = `SELECT 
        conceptId, 
        displayName, 
        MATCH(displayName, description, alternateNames) AGAINST(?) AS relevance
    FROM Categories
    HAVING relevance > 0
    ORDER BY relevance DESC`;
    pool.query(selectMatch, [query], callback);
}

function category(pool, conceptId, callback) {
    const selectCategory = 'SELECT * FROM Categories WHERE conceptId = ?';

    const selectParents = `
    SELECT conceptId, displayName 
    FROM Categories JOIN Edges 
    ON Categories.conceptId = Edges.parentId 
    WHERE Edges.childId = ?`;

    const selectChildren = `SELECT conceptId, displayName
    FROM Categories JOIN Edges 
    ON Categories.conceptId = Edges.childId
    WHERE Edges.parentId = ?`;

    pool.getConnection((err, connection) => {
        if (err) {
            callback(err, []);
            return;
        }
        let cleanup = (e, rows) => {
            connection.release(); 
            callback(e, rows);
        };
        connection.query(selectCategory, [conceptId], (err, rows) => {
            if (err) {
                cleanup(err, rows);
                return;
            }
            if (!rows || rows.length != 1) {
                const e = new Error(`Concept with ID ${conceptId} does not exist.`);
                e.notFound = true;
                cleanup(e, []);
                return;
            }
            const category = rows[0];
            connection.query(selectParents, [conceptId], (err, rows) => {
                if (err) {
                    cleanup(err, rows);
                    return;
                }
                category.parents = rows;
                connection.query(selectChildren, [conceptId], (err, rows) => {
                    if (err) {
                        cleanup(err, rows);
                        return;
                    }
                    category.children = rows;
                    cleanup(null, category);
                });
            });
        });
    });
}

exports.connect = connect;
exports.categories = categories;
exports.category = category;
exports.search = search;