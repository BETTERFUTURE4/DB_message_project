const mysql = require('mysql');
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'test',
    database: 'test',
    multipleStatements: true,
    connectionLimit: 1000,
});


exports.query = query => new Promise((resolve, reject) => {
    connection.getConnection((err, connection) => {
        if (err) {
            console.log ('Error 1');
            return reject(err);
        }

        return connection.query(query, (err2, rows) => {
            connection.release();
            if (err2) {
                console.log('Error 2');
                return reject(err);
            }
            return resolve(rows);
        })
    });
});