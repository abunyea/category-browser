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

exports.connect = connect;