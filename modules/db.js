const mysql = require('mysql');

const connection = mysql.createPool({
    host: '165.132.105.26',
    user: 'team06',
    password: 'project06', // DB password
    port: 3306,
    database: 'database06', // DB name
    multipleStatements: true,
    connectionLimit: 1000,
});

/*
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'test', // DB password
    port: 3306,
    database: 'db', // DB name
    multipleStatements: true,
    connectionLimit: 1000,
});
*/

// Send SQL to DB and Receive return value
// Promise --> Async
// Await --> Block
exports.query = query => new Promise((resolve, reject) => {
    connection.getConnection((err, connection) => {
        if(err) return reject(err);
        return connection.query(query, (err2, rows) => {
            connection.release();
            if(err2) return reject(err);
            return resolve(rows);
        })
    });
});
