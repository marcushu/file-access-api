const mysql = require('mysql');

exports.con = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: 'apiUsersDB',
    }
)


