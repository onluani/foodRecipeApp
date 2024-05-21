const mysql = require('mysql');

//create connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user1',
    password: '1234',
    database: 'mydatabase'
});

//open the MySQL connection
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;