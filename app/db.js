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

function listCategories(pool, callback) {
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

function getCategory(pool, conceptId, callback) {
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

function createCategory(pool, displayName, alternateNames, description, parentIds, callback) {
    const insert = `INSERT INTO 
        Categories (displayName, alternateNames, description)
        VALUES (?, ?, ?);`;
    
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }
        let cleanup = (e, result) => {
            connection.release(); 
            console.log('Released connection');
            callback(e, result);
        };
        connection.beginTransaction((err) => {
            console.log('Transaction started');
            pool.query(insert, [displayName, alternateNames, description], (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        cleanup(err);
                    });
                }
                console.log('Inserted category');
                const newConceptId = result.insertId;
                if (parentIds.length < 1) {
                    connection.commit((err) => {
                        console.log('Committed result');
                        cleanup(err, { conceptId: newConceptId });
                    });
                    return;
                }
                const parentChildren = [];
                parentIds.forEach(parentId => {
                    parentChildren.push([parentId, newConceptId]);
                });
                console.log(parentChildren);
                pool.query(`INSERT INTO Edges (parentId, childId) VALUES ?;`, [parentChildren], (err) => {
                    console.log('Inserted edges');
                    if (err) {
                        return connection.rollback(() => {
                            cleanup(err);
                        });
                    }
                    connection.commit((err) => {
                        console.log('Committed result');
                        cleanup(err, { conceptId: newConceptId });
                    });
                });
            });
        });
    });
}

function updateCategory(pool, conceptId, displayName, alternateNames, description, parentIds, callback) {
    const insert = `UPDATE Categories
        SET displayName = ?, alternateNames = ?, description = ?
        WHERE conceptId = ?`;
    const insertEdges = `INSERT INTO Edges (parentId, childId) VALUES ?;`;
    
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }
        let cleanup = (e) => {
            connection.release(); 
            callback(e);
        };
        connection.beginTransaction((err) => {
            pool.query(insert, [displayName, alternateNames, description, conceptId], (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        cleanup(err);
                    });
                }
                if (parentIds.length < 1) {
                    connection.commit((err) => {
                        cleanup(err);
                    });
                    return;
                }
                const parentChildren = [];
                parentIds.forEach(parentId => {
                    parentChildren.push([parentId, conceptId]);
                });
                pool.query(insertEdges, [parentChildren], (err) => {
                    if (err) {
                        return connection.rollback(() => {
                            cleanup(err);
                        });
                    }
                    connection.commit((err) => {
                        cleanup(err);
                    });
                });
            });
        });
    });
}

function deleteCategory(pool, conceptId, callback) {
    const deleteCategory = 'DELETE FROM Categories WHERE conceptId = ?;';
    const deleteEdges = 'DELETE FROM Edges WHERE parentId = ? OR childId = ?;';

    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err);
        }
        let cleanup = (e) => {
            connection.release(); 
            callback(e);
        };
        connection.beginTransaction((err) => {
            pool.query(deleteCategory, [conceptId], (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        cleanup(err);
                    });
                }
                pool.query(deleteEdges, [conceptId, conceptId], (err) => {
                    if (err) {
                        return connection.rollback(() => {
                            cleanup(err);
                        });
                    }
                    connection.commit((err) => {
                        cleanup(err);
                    });
                });
            });
        });
    });
}

exports.connect = connect;
exports.listCategories = listCategories;
exports.getCategory = getCategory;
exports.search = search;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
