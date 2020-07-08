# file-access-api
A drop-in file browswer exposed via a REST API.  

A database is required for Password authentication. Add the correct settings to mysqlConfig.js (see below).  Any DB can be used provided it is set up to handle a username and an encripted password (min 75 characters), and the appropriate changes are made to useraccess.js.  

The software has been used with the following MySql setup:


**apiUsersDB**
Tables_in_apiUsersDB
|----------------------
users               

**users**
| Field    | Type         | Null | Key | Default |
|----------|--------------|------|-----|---------|
| userName | varchar(25)  | YES  |     | NULL    |
| passWord | varchar(100) | YES  |     | NULL    |
